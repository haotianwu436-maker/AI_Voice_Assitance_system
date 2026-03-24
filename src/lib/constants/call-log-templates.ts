import type { CustomerStatus } from "@/lib/constants/customer-status";

export type CallLogTemplate = {
  key: string;
  label: string;
  status: CustomerStatus;
  remark: string;
  wechatAdded: boolean;
  interested: boolean;
};

export const COMMON_CALL_LOG_TEMPLATES: CallLogTemplate[] = [
  {
    key: "no_answer",
    label: "未接通-无人接听",
    status: "未接通",
    remark: "无人接听，稍后再拨。",
    wechatAdded: false,
    interested: false
  },
  {
    key: "power_off",
    label: "未接通-已关机",
    status: "未接通",
    remark: "电话关机，稍后重试。",
    wechatAdded: false,
    interested: false
  },
  {
    key: "connected_follow",
    label: "已接通-待跟进",
    status: "已接通",
    remark: "已接通，后续继续跟进。",
    wechatAdded: false,
    interested: false
  },
  {
    key: "wechat_added",
    label: "已加微信",
    status: "已加微信",
    remark: "已添加微信，等待进一步沟通。",
    wechatAdded: true,
    interested: false
  },
  {
    key: "intent_demo",
    label: "有意向-约演示",
    status: "有意向",
    remark: "客户有意向，已预约产品演示。",
    wechatAdded: true,
    interested: true
  },
  {
    key: "no_intent",
    label: "无意向",
    status: "无意向",
    remark: "当前无意向，后续低频触达。",
    wechatAdded: false,
    interested: false
  }
];

