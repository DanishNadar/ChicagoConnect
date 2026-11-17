import "./globals.css";
import Link from "next/link";
export const metadata = { title:"Chicago Connect", description:"Chicago professional networking events" };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body><header className="shell"><nav className="nav"><Link className="brand" href="/">Chicago <i>Connect</i></Link><div className="links"><Link href="/explore">Explore</Link><Link href="/calendar">Calendar</Link><Link href="/pipeline">Data pipeline</Link></div></nav></header>{children}<footer className="shell footer">Chicago Connect · Verified event discovery, with links back to every original source.</footer></body></html>; }
