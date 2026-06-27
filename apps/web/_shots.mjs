import { chromium } from 'playwright';
const BASE='http://localhost:3000', OUT='../../.hc/j9-rebuild/build-shots';
const log=(...a)=>console.log('[sw]',...a);
const b=await chromium.launch();
try{
  const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:2});
  const p=await ctx.newPage();
  const shot=async(n,full=false)=>{await p.screenshot({path:`${OUT}/SW-${n}.png`,fullPage:full});log('saved',n);};
  await p.goto(`${BASE}/`,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(1300);
  await shot('home-top',false); await shot('home-full',true);
  // auth modal
  try{ const lg=p.getByRole('button',{name:/^Đăng ký$|^Đăng nhập$/}).first(); if(await lg.count()){await lg.click();await p.waitForTimeout(700);await shot('modal',false);await p.keyboard.press('Escape').catch(()=>{});await p.waitForTimeout(300);} }catch(e){log('modal',e.message);}
  await p.goto(`${BASE}/vip`,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(900); await shot('vip',true);
  await ctx.close(); log('DONE');
}finally{await b.close();}
