import localFont from "next/font/local";
import "./globals.css";

const minecraftFont = localFont({
  src: "../../public/fonts/minecraft.woff2",
  variable: "--font-minecraft",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={minecraftFont.variable}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
