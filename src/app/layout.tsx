import Simple from "@/components/Navbar";
import "./globals.css";
import "./pages.css";
import { Providers } from "./providers";
import { Box } from "@chakra-ui/layout";

export const metadata = {
  title: "New title",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[color:var(--background-color)]">
        <Providers>
          <Simple></Simple>
          <Box p={7}>{children}</Box>
        </Providers>
      </body>
    </html>
  );
}
