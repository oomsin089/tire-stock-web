"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "ภาพรวม" },
  { href: "/receive", label: "รับเข้า" },
  { href: "/sell", label: "ขายออก" },
  { href: "/transfer", label: "ย้ายพื้นที่" },
  { href: "/manage", label: "จัดการข้อมูล" },
];

export default function Nav() {
  const path = usePathname();
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link href="/" className="brand">
          <span className="brand-plate">V-AUTO</span>
          <span className="brand-sub">ระบบสต๊อกยาง</span>
        </Link>
        <nav className="nav">
          {LINKS.map((l) => {
            const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href} className={active ? "active" : ""}>
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
