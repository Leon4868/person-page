import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://mayongchao-ai-portfolio.stony-river-7169.chatgpt.site"),
  title: "徐小龙 · AI 全栈 / Agent 工程师",
  description: "徐小龙的个人作品集：AI 研发工作流与工程规范、企业 AI 编码配置中台、Agent 生产化、全栈系统与云原生交付。",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: { title: "徐小龙 · AI 全栈 / Agent 工程师", description: "10 年研发经验，把复杂想法构建成可运行的智能系统。", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: "徐小龙 · AI 全栈 / Agent 工程师", description: "10 年研发经验，把复杂想法构建成可运行的智能系统。", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
