import { ModeToggle } from "@/components/ui/theme-toggle";

export default function RoutesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ModeToggle />
      <div>{children}</div>
    </>
  );
}
