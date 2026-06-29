import "./globals.css";

export const metadata = {
  title: "A very important question",
  description: "Don't worry, it's pass/fail.",
  openGraph: {
    title: "A very important question",
    description: "Will you spend the BOD meeting with me as ur assistant?",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "A very important question",
    description: "Will you spend the BOD meeting with me as ur assistant?",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
