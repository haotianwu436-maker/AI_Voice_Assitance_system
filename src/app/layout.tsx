import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "外呼助手系统 MVP",
  description: "销售外呼管理系统"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
