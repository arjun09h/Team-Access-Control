import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "./provider/AuthProvider";



export const metadata: Metadata = {
  title: "Team Access Control",
  description: "Role Based Team Access Control System build with Nextjs 16 and React 19",
  keywords: ['team','access control']
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en" suppressHydrationWarning
    >
      <body className="min-h-screen bg-slate-950 text-slate">
        <AuthProvider>
          {children}
          </AuthProvider>
          </body>
    </html>
  );
}
 