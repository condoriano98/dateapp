import "./globals.css";

export const metadata = {
  title: "A very important question",
  description: "Don't worry, it's pass/fail.",
  openGraph: {
    title: "A very important question",
    description: "Will you go on a date with me?",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "A very important question",
    description: "Will you go on a date with me?",
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
