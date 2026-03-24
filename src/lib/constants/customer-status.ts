import type { Database } from "@/types/database";

export type CustomerStatus = Database["public"]["Enums"]["customer_status"];

export const CUSTOMER_STATUS_OPTIONS: CustomerStatus[] = [
  "未拨打",
  "未接通",
  "已接通",
  "已加微信",
  "有意向",
  "无意向"
];
