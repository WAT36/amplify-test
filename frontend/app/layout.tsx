import type { Metadata } from "next";
import "./globals.css";
import ConfigureAmplify from "./ConfigureAmplify";

export const metadata: Metadata = {
  title: "My Amplify App",
  description: "Created with Amplify Gen 2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <ConfigureAmplify>{children}</ConfigureAmplify>
      </body>
    </html>
  );
}
