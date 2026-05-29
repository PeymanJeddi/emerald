import localFont from "next/font/local";

export const inter = localFont({
  src: "../assets/fonts/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

export const cormorant = localFont({
  src: [
    {
      path: "../assets/fonts/cormorant-garamond-latin-400-normal.woff2",
      weight: "400",
    },
    {
      path: "../assets/fonts/cormorant-garamond-latin-500-normal.woff2",
      weight: "500",
    },
    {
      path: "../assets/fonts/cormorant-garamond-latin-600-normal.woff2",
      weight: "600",
    },
  ],
  variable: "--font-cormorant",
  display: "swap",
});
