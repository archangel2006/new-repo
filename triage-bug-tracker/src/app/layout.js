import "./globals.css";

export const metadata = {
  title: "Triage — Bug tracking for teams that ship fast",
  description: "Track, prioritize, and resolve bugs with Triage.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full dark antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
