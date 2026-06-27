/* Yaobet mock — points store (SPEC-03 §store). */

import type { Product } from "../types";
import { DEMO_EMPTY, isoIn, simulateFetch } from "./helpers";

const PROD = "/assets/placeholders/product.svg";

const PRODUCTS: Product[] = [
  { id: "s1", name: "Tai nghe không dây", imageSrc: PROD, pointsPrice: 6_800, redeemedCount: 168, endsAt: null },
  { id: "s2", name: "Sạc dự phòng", imageSrc: PROD, pointsPrice: 3_800, redeemedCount: 286, endsAt: null },
  { id: "s3", name: "Đồng hồ thông minh", imageSrc: PROD, pointsPrice: 18_800, redeemedCount: 66, endsAt: isoIn(4320) },
  { id: "s4", name: "Voucher 500K", imageSrc: PROD, pointsPrice: 8_800, redeemedCount: 888, endsAt: null },
];

export async function getProducts(): Promise<Product[]> {
  return simulateFetch(DEMO_EMPTY ? [] : PRODUCTS);
}

export async function getPointsBalance(): Promise<number> {
  return simulateFetch(DEMO_EMPTY ? 0 : 12_868);
}
