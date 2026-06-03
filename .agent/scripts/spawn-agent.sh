#!/usr/bin/env bash
# ============================================================================
# spawn-agent.sh — Spawn a headless CLI worker agent
#
# Bash port of spawn-agent.ps1 for macOS/Linux.
# Spawns a headless CLI worker agent to execute a scoped task.
# Supports any CLI agent (gemini, codex, claude, aider, etc.).
#
# EXAMPLES:
#   # Gemini — research (yolo, read-only)
#   ./spawn-agent.sh --agent gemini --approval-mode Yolo --timeout 120 \
#       --file .agent/spawn_agent_tasks/research.md
#
#   # Claude — implementation (auto-approve edits, no timeout)
#   ./spawn-agent.sh --agent claude \
#       --extra-args "--dangerously-skip-permissions" \
#       --file .agent/spawn_agent_tasks/task.md
#
#   # Quick inline task
#   ./spawn-agent.sh --agent gemini --approval-mode AutoEdit --timeout 60 \
#       --prompt "Fix typo 'recieve' -> 'receive' in auth.service.ts"
#
#   # Model tier shortcut (overrides approval-mode + timeout)
#   ./spawn-agent.sh --model-tier Mechanical --file task.md
#
#   # Pipe prompt from stdin
#   cat task.md | ./spawn-agent.sh --agent gemini --timeout 300
#
# REQUIRES: bash 3.2+, perl (for GEMINI.md sanitization)
# ============================================================================
set -uo pipefail

# ─── Constants ──────────────────────────────────────────────────────────────
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
readonly TASKS_DIR="${PROJECT_ROOT}/.agent/spawn_agent_tasks"
readonly BENCHMARK_FILE="${PROJECT_ROOT}/.agent/benchmarks/_archive/spawn-agent-benchmark.md"
readonly MAX_ATTEMPTS=5

# ─── Colors (ANSI) ──────────────────────────────────────────────────────────
readonly C_RED='\033[0;31m'
readonly C_YELLOW='\033[0;33m'
readonly C_CYAN='\033[0;36m'
readonly C_GREEN='\033[0;32m'
readonly C_BOLD='\033[1m'
readonly C_RESET='\033[0m'

# ─── Defaults ───────────────────────────────────────────────────────────────
agent="gemini"
approval_mode="AutoEdit"
model_tier=""
timeout_seconds=0
prompt=""
file=""
output_file=""
extra_args=""
freeze_path=""
async_mode=false
dry_run=false

# ─── Temp file tracking for cleanup ─────────────────────────────────────────
tmp_out=""
tmp_err=""
timeout_marker=""
timer_pid=""
agent_pid=""

# ============================================================================
# Functions
# ============================================================================

usage() {
    cat <<'EOF'
Usage: spawn-agent.sh [OPTIONS]

Spawn a headless CLI worker agent to execute a scoped task.

OPTIONS:
  -a, --agent NAME          CLI agent to use (default: gemini)
                            Supported: gemini, claude, codex, aider
  -m, --approval-mode MODE  Approval mode: Yolo, AutoEdit, Safe (default: AutoEdit)
  -t, --model-tier TIER     Override approval-mode + timeout by tier:
                            Mechanical (Yolo/60s), Integration (AutoEdit/300s),
                            Architecture (AutoEdit/600s)
  -T, --timeout SECONDS     Max execution time, 0 = no limit (default: 0)
  -p, --prompt TEXT         Inline prompt text
  -f, --file PATH           Read prompt from file
  -o, --output PATH         Output log file path (auto-generated if omitted)
  -e, --extra-args ARGS     Additional CLI arguments (space-separated string)
      --freeze-path PATH    Restrict agent to this directory only
      --async               Run agent in background
      --dry-run             Show command without executing
  -h, --help                Show this help message

PROMPT INPUT (one required):
  --prompt "text"           Inline prompt
  --file path/to/task.md    Prompt from file
  echo "text" | spawn-agent.sh   Pipe via stdin

EXIT CODES:
  0     Agent completed successfully
  1     Agent failed
  124   Agent timed out
EOF
    exit 0
}

log_info()  { printf "${C_BOLD}%s${C_RESET}\n" "$*"; }
log_warn()  { printf "${C_YELLOW}[WARN] %s${C_RESET}\n" "$*" >&2; }
log_error() { printf "${C_RED}[ERROR] %s${C_RESET}\n" "$*" >&2; }
log_cyan()  { printf "${C_CYAN}%s${C_RESET}\n" "$*"; }

cleanup() {
    # Kill child processes on exit
    if [ -n "$timer_pid" ] && kill -0 "$timer_pid" 2>/dev/null; then
        kill "$timer_pid" 2>/dev/null
        wait "$timer_pid" 2>/dev/null
    fi
    if [ -n "$agent_pid" ] && kill -0 "$agent_pid" 2>/dev/null; then
        kill -TERM "$agent_pid" 2>/dev/null
        sleep 1
        kill -9 "$agent_pid" 2>/dev/null
        wait "$agent_pid" 2>/dev/null
    fi
    # Remove temp files
    rm -f "$tmp_out" "$tmp_err" "$timeout_marker" 2>/dev/null
}

# ─── Argument Parsing ───────────────────────────────────────────────────────
parse_args() {
    while [ $# -gt 0 ]; do
        case "$1" in
            -a|--agent)         agent="$2";          shift 2 ;;
            -m|--approval-mode) approval_mode="$2";  shift 2 ;;
            -t|--model-tier)    model_tier="$2";     shift 2 ;;
            -T|--timeout)       timeout_seconds="$2"; shift 2 ;;
            -p|--prompt)        prompt="$2";         shift 2 ;;
            -f|--file)          file="$2";           shift 2 ;;
            -o|--output)        output_file="$2";    shift 2 ;;
            -e|--extra-args)    extra_args="$2";     shift 2 ;;
            --freeze-path)      freeze_path="$2";    shift 2 ;;
            --async)            async_mode=true;     shift ;;
            --dry-run)          dry_run=true;        shift ;;
            -h|--help)          usage ;;
            *)
                log_error "Unknown option: $1"
                echo "Use --help for usage information."
                exit 1
                ;;
        esac
    done
}

# ─── Model Tier Enforcement ─────────────────────────────────────────────────
apply_model_tier() {
    case "$model_tier" in
        Mechanical)
            approval_mode="Yolo"
            timeout_seconds=60
            log_info "[TIER] Mechanical: forcing --approval-mode Yolo --timeout 60"
            ;;
        Integration)
            approval_mode="AutoEdit"
            timeout_seconds=300
            log_info "[TIER] Integration: forcing --approval-mode AutoEdit --timeout 300"
            ;;
        Architecture)
            approval_mode="AutoEdit"
            timeout_seconds=600
            log_info "[TIER] Architecture: forcing --approval-mode AutoEdit --timeout 600"
            ;;
        "")
            ;; # No tier specified
        *)
            log_error "Invalid model tier: $model_tier (valid: Mechanical, Integration, Architecture)"
            exit 1
            ;;
    esac
}

# ─── Resolve Prompt ─────────────────────────────────────────────────────────
resolve_prompt() {
    # From file
    if [ -n "$file" ]; then
        if [ ! -f "$file" ]; then
            log_error "Prompt file not found: $file"
            exit 1
        fi
        prompt="$(cat "$file")"
    fi

    # From stdin (if no prompt yet and stdin is piped)
    if [ -z "$prompt" ]; then
        if [ ! -t 0 ]; then
            prompt="$(cat)"
        else
            log_error "No prompt provided. Use --prompt, --file, or pipe input."
            echo "Use --help for usage information."
            exit 1
        fi
    fi

    # Validate non-empty
    if [ -z "$(echo "$prompt" | tr -d '[:space:]')" ]; then
        log_error "Empty prompt."
        exit 1
    fi

    # Inject freeze path constraint
    if [ -n "$freeze_path" ]; then
        log_cyan "[FREEZE] Injecting Directory Freezing constraint for: $freeze_path"
        prompt="${prompt}

[CRITICAL CONTENTION AVOIDANCE: You are computationally FROZEN to the directory '${freeze_path}'. You MUST NOT read, edit, or modify any source files outside this path unless explicitly authorized by @pm. This is a strict framework rule (anti-patterns.md Section 9).]"
    fi
}

# ─── Sanitize Global GEMINI.md ──────────────────────────────────────────────
# Removes rogue @agent tags from the user's global GEMINI.md context file
# that cause Gemini CLI crashes. Uses perl for lookbehind regex support.
sanitize_gemini_md() {
    local gemini_file="${HOME}/.gemini/GEMINI.md"
    [ -f "$gemini_file" ] || return 0

    # Check if file contains rogue @ tags (not preceded by alphanumeric/dot/plus/underscore)
    if perl -ne 'exit 1 if /(?<![a-zA-Z0-9.+_])\@[a-zA-Z0-9\-]+/' "$gemini_file" 2>/dev/null; then
        return 0  # No rogue tags found
    fi

    log_warn "Patching global GEMINI.md to remove rogue @ tags that cause CLI crashes"
    if perl -pi -e 's/(?<![a-zA-Z0-9.+_])\@([a-zA-Z0-9\-]+)/$1/g' "$gemini_file" 2>/dev/null; then
        return 0
    else
        log_warn "Failed to patch global GEMINI.md"
    fi
}

# ─── Build Approval Flags ───────────────────────────────────────────────────
# Returns approval flags as space-separated string based on agent and mode.
get_approval_flags() {
    local agent_lower
    agent_lower="$(echo "$1" | tr '[:upper:]' '[:lower:]')"
    local mode="$2"

    case "$agent_lower" in
        gemini)
            local mode_value
            case "$mode" in
                Yolo)     mode_value="yolo" ;;
                AutoEdit) mode_value="auto_edit" ;;
                Safe)     mode_value="default" ;;
                *)        mode_value="auto_edit" ;;
            esac
            echo "--approval-mode ${mode_value}"
            ;;
        codex)
            local mode_value
            case "$mode" in
                Yolo)     mode_value="full-auto" ;;
                AutoEdit) mode_value="auto-edit" ;;
                Safe)     mode_value="suggest" ;;
                *)        mode_value="auto-edit" ;;
            esac
            echo "exec -c approval_mode=\"${mode_value}\""
            ;;
        claude|*)
            # Claude and other agents use extra-args for approval
            echo ""
            ;;
    esac
}

# ─── Sync Kickstart Scripts ─────────────────────────────────────────────────
# Copies pm.sh/pm.cmd/pm.ps1 to project root if source is newer than target.
update_kickstart_scripts() {
    local scripts=("pm.sh" "pm.cmd" "pm.ps1")
    for script in "${scripts[@]}"; do
        local source="${SCRIPT_DIR}/${script}"
        local target="${PROJECT_ROOT}/${script}"
        if [ -f "$source" ]; then
            if [ ! -f "$target" ] || [ "$source" -nt "$target" ]; then
                cp "$source" "$target"
            fi
        fi
    done
}

# ─── Display Banner ─────────────────────────────────────────────────────────
show_banner() {
    local agent_upper
    agent_upper="$(echo "$agent" | tr '[:lower:]' '[:upper:]')"
    local dry_label=""
    [ "$dry_run" = true ] && dry_label=" [DRY RUN]"
    local timeout_display="None (wait forever)"
    [ "$timeout_seconds" -gt 0 ] && timeout_display="${timeout_seconds}s"

    echo "+======================================================"
    echo "|  Spawning ${agent_upper} agent${dry_label}"
    echo "+------------------------------------------------------"
    echo "|  Agent:   ${agent}"
    echo "|  Mode:    ${mode_display}"
    echo "|  Timeout: ${timeout_display}"
    echo "|  Output:  ${output_file}"
    echo "+======================================================"
}

# ─── Write Log Header ───────────────────────────────────────────────────────
write_log_header() {
    local agent_upper
    agent_upper="$(echo "$agent" | tr '[:lower:]' '[:upper:]')"
    local timeout_display="None (wait forever)"
    [ "$timeout_seconds" -gt 0 ] && timeout_display="${timeout_seconds}s"
    local prompt_preview
    prompt_preview="$(echo "$prompt" | tr '\n\r' '  ' | head -c 200)"

    {
        echo "=== Spawn Agent: ${agent_upper} ==="
        echo "Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
        echo "Mode: ${mode_display}"
        echo "Timeout: ${timeout_display}"
        echo "Prompt preview: ${prompt_preview}..."
        echo "================================"
        echo ""
    } | tee "$output_file"
}

# ─── Run Agent Process ──────────────────────────────────────────────────────
# Executes the agent with retry logic, timeout handling, and output capture.
run_agent_process() {
    local agent_lower
    agent_lower="$(echo "$agent" | tr '[:upper:]' '[:lower:]')"
    local agent_upper
    agent_upper="$(echo "$agent" | tr '[:lower:]' '[:upper:]')"
    local use_stdin=false
    local exit_code=1

    # Build command arguments array
    local -a cmd_args=()

    # Add approval flags
    if [ -n "$mode_display" ] && [ "$mode_display" != "(custom via --extra-args)" ]; then
        # shellcheck disable=SC2206
        cmd_args+=($approval_flags_raw)
    fi

    # Add extra args
    if [ -n "$extra_args" ]; then
        # shellcheck disable=SC2206
        cmd_args+=($extra_args)
    fi

    # Determine stdin vs argument prompt injection
    case "$agent_lower" in
        gemini|claude)
            use_stdin=true
            if [ "$agent_lower" = "gemini" ]; then
                cmd_args+=("-p" " ")
            fi
            ;;
        codex)
            cmd_args+=("$prompt")
            ;;
        *)
            cmd_args+=("-p" "$prompt")
            ;;
    esac

    # Create temp files
    local temp_id
    temp_id="$(date +%s)-$$"
    tmp_out="${TASKS_DIR}/temp_out_${temp_id}.log"
    tmp_err="${TASKS_DIR}/temp_err_${temp_id}.log"
    timeout_marker="${TASKS_DIR}/temp_timeout_${temp_id}.marker"

    # ─── Async Mode ──────────────────────────────────────────────────────
    if [ "$async_mode" = true ]; then
        # Random jitter: 10-20 seconds to avoid thundering herd
        local jitter=$(( (RANDOM % 10) + 10 ))
        sleep "$jitter"

        if [ "$use_stdin" = true ]; then
            printf '%s\n' "$prompt" | nohup "$agent" "${cmd_args[@]}" >> "$output_file" 2>&1 &
        else
            nohup "$agent" "${cmd_args[@]}" >> "$output_file" 2>&1 &
        fi
        disown

        echo ""
        log_cyan "+======================================================"
        log_cyan "|  [ASYNC] ${agent_upper} agent started in background."
        log_cyan "|  Logs will stream to: ${output_file}"
        log_cyan "+======================================================"
        exit 0
    fi

    # ─── Sync Mode with Retry Loop ───────────────────────────────────────
    local attempt=1
    local success=false

    while [ "$attempt" -le "$MAX_ATTEMPTS" ] && [ "$success" = false ]; do
        if [ "$attempt" -gt 1 ]; then
            log_warn "Retry attempt ${attempt}/${MAX_ATTEMPTS} triggered for ${agent}..."
        fi

        # Random jitter: 5-15 seconds before each attempt
        local jitter=$(( (RANDOM % 10) + 5 ))
        sleep "$jitter"

        # Clean temp files from previous attempt
        rm -f "$tmp_out" "$tmp_err" "$timeout_marker" 2>/dev/null

        # Launch agent process
        if [ "$use_stdin" = true ]; then
            printf '%s\n' "$prompt" | "$agent" "${cmd_args[@]}" > "$tmp_out" 2> "$tmp_err" &
        else
            "$agent" "${cmd_args[@]}" > "$tmp_out" 2> "$tmp_err" &
        fi
        agent_pid=$!

        # ─── Timeout Handling ────────────────────────────────────────────
        if [ "$timeout_seconds" -gt 0 ]; then
            (
                sleep "$timeout_seconds"
                if kill -0 "$agent_pid" 2>/dev/null; then
                    touch "$timeout_marker"
                    kill -TERM "$agent_pid" 2>/dev/null
                    sleep 2
                    kill -9 "$agent_pid" 2>/dev/null
                fi
            ) &
            timer_pid=$!

            wait "$agent_pid" 2>/dev/null
            exit_code=$?

            # Kill timer if agent finished before timeout
            if kill -0 "$timer_pid" 2>/dev/null; then
                kill "$timer_pid" 2>/dev/null
                wait "$timer_pid" 2>/dev/null
            fi

            # Check if timeout occurred
            if [ -f "$timeout_marker" ]; then
                exit_code=124
                echo ""
                log_warn "${agent_upper} agent timed out after ${timeout_seconds}s"
            fi
        else
            # No timeout — wait indefinitely
            wait "$agent_pid"
            exit_code=$?
        fi

        agent_pid=""
        timer_pid=""

        # ─── Capture Output ──────────────────────────────────────────────
        local agent_output=""
        local err_output=""
        [ -f "$tmp_out" ] && agent_output="$(cat "$tmp_out")"
        [ -f "$tmp_err" ] && err_output="$(cat "$tmp_err")"

        # Append to output log
        [ -n "$agent_output" ] && echo "$agent_output" >> "$output_file"
        [ -n "$agent_output" ] && echo "$agent_output"

        [ -n "$err_output" ] && echo "$err_output" >> "$output_file"
        [ -n "$err_output" ] && printf "${C_YELLOW}%s${C_RESET}\n" "$err_output"

        # ─── Error Detection & Retry Logic ────────────────────────────────
        # Check for API capacity exhaustion (429)
        if echo "$agent_output" "$err_output" | grep -qi 'exhausted your capacity\|429'; then
            log_error "Gemini API Capacity Exhausted detected! (Code 429)"
            exit_code=1
            if [ "$attempt" -lt "$MAX_ATTEMPTS" ]; then
                # Exponential backoff: 30, 60, 120, 240 seconds
                local backoff=$(( 30 * (1 << (attempt - 1)) ))
                log_warn "Sleeping ${backoff} seconds before retry (Exponential Backoff)..."
                sleep "$backoff"
                attempt=$((attempt + 1))
                continue
            fi

        # Check for [ERROR] in output despite exit code 0
        elif [ "$exit_code" -eq 0 ] && echo "$agent_output" "$err_output" | grep -q '^\[ERROR\]'; then
            log_warn "ExitCode 0 but log contains [ERROR]. Overriding ExitCode to 1."
            exit_code=1

        # Check for failure with no output (transient failure)
        elif [ "$exit_code" -ne 0 ] && [ -z "$(echo "$agent_output" | tr -d '[:space:]')" ] && [ "$attempt" -lt "$MAX_ATTEMPTS" ]; then
            log_warn "Agent process failed with no output (exit code: ${exit_code}). Retrying..."
            sleep $((5 * attempt))
            attempt=$((attempt + 1))
            continue
        fi

        success=true
    done

    return "$exit_code"
}

# ─── Log Benchmark ──────────────────────────────────────────────────────────
log_benchmark() {
    local exit_code="$1"
    [ -f "$BENCHMARK_FILE" ] || return 0

    local agent_upper
    agent_upper="$(echo "$agent" | tr '[:lower:]' '[:upper:]')"
    local timeout_display="None (wait forever)"
    [ "$timeout_seconds" -gt 0 ] && timeout_display="${timeout_seconds}s"

    # Calculate duration
    local end_epoch
    end_epoch="$(date +%s)"
    local duration="$((end_epoch - start_epoch))"

    local prompt_len="${#prompt}"
    local status_icon
    case "$exit_code" in
        0)   status_icon="+" ;;
        124) status_icon="T" ;;
        *)   status_icon="X" ;;
    esac

    local task_name="inline"
    if [ -n "$file" ]; then
        task_name="$(basename "$file" | sed 's/\.[^.]*$//')"
    fi

    local bench_line="| $(date '+%Y-%m-%d') | ${task_name} | ${agent_upper} | ${mode_display} | ${prompt_len} chars | ${duration}s | ${timeout_display} | ${exit_code} | ${status_icon} |"
    echo "$bench_line" >> "$BENCHMARK_FILE"
    log_info "[BENCH] Benchmark logged to ${BENCHMARK_FILE}"
}

# ============================================================================
# Main
# ============================================================================

main() {
    parse_args "$@"
    apply_model_tier
    resolve_prompt

    # Validate agent CLI exists
    if ! command -v "$agent" &>/dev/null; then
        log_error "'${agent}' CLI not found. Ensure it is installed and on your PATH."
        exit 1
    fi

    # Validate timeout is a non-negative integer
    if ! echo "$timeout_seconds" | grep -qE '^[0-9]+$'; then
        log_error "Timeout must be a non-negative integer, got: ${timeout_seconds}"
        exit 1
    fi

    # Record start time for benchmark
    start_epoch="$(date +%s)"
    local timestamp
    timestamp="$(date '+%Y%m%d-%H%M%S')"

    # Build approval flags
    approval_flags_raw="$(get_approval_flags "$agent" "$approval_mode")"
    if [ -n "$approval_flags_raw" ]; then
        mode_display="$approval_flags_raw"
    else
        mode_display="(custom via --extra-args)"
    fi

    # Generate output file path if not specified
    local temp_id
    temp_id="$(echo "$timestamp-$$" | head -c 24)"
    if [ -z "$output_file" ]; then
        output_file="${TASKS_DIR}/output-${temp_id}.log"
    fi

    # Ensure tasks directory exists
    mkdir -p "$TASKS_DIR"

    # Sanitize global GEMINI.md
    sanitize_gemini_md

    # Sync kickstart scripts to project root
    update_kickstart_scripts

    # Set up signal trap for clean exit
    trap cleanup EXIT INT TERM

    # Display banner
    show_banner

    # Dry run mode
    if [ "$dry_run" = true ]; then
        echo ""
        echo "[DRY] DRY RUN -- Command that would be executed:"
        echo "  ${agent} ${approval_flags_raw} ${extra_args}"
        exit 0
    fi

    # Write log header
    write_log_header

    # Execute agent
    local exit_code=1
    if run_agent_process; then
        exit_code=0
    else
        exit_code=$?
    fi

    # Write footer
    local footer
    footer="$(printf '\n================================\nExit code: %d\nCompleted: %s\n' "$exit_code" "$(date '+%Y-%m-%d %H:%M:%S')")"
    echo "$footer" | tee -a "$output_file"

    # Log benchmark
    log_benchmark "$exit_code"

    # Final status
    local agent_upper
    agent_upper="$(echo "$agent" | tr '[:lower:]' '[:upper:]')"
    echo ""
    if [ "$exit_code" -eq 0 ]; then
        printf "${C_GREEN}[OK] %s agent completed successfully${C_RESET}\n" "$agent_upper"
        printf "${C_GREEN}[OK] Full output: %s${C_RESET}\n" "$output_file"
    elif [ "$exit_code" -eq 124 ]; then
        log_warn "[TIMEOUT] ${agent_upper} agent timed out after ${timeout_seconds}s"
        log_warn "[LOG] Partial output: ${output_file}"
    else
        log_error "[FAIL] ${agent_upper} agent failed (exit code: ${exit_code})"
        log_error "[LOG] Output with errors: ${output_file}"
    fi

    exit "$exit_code"
}

main "$@"
