import "./globals.css";

export const metadata = {
  title: "A very important question",
  description: "Don't worry, it's pass/fail.",
  openGraph: {
    title: "A very important question",
    description: "Will you spend the BOD meeting over dinner?",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "A very important question",
    description: "Will you spend the BOD meeting over dinner?",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;0,800;1,600;1,800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
