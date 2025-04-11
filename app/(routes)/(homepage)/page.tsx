import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex gap-4 items-center justify-center min-h-screen p-4">
      <Link href="/users"><Button size="sm" className="cursor-pointer">Users</Button></Link>
      <Link href="/payments"><Button size="sm" className="cursor-pointer">Payments</Button></Link>
    </div>
  );
}
