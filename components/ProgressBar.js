"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProgressBar() {
  const pathname = usePathname();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    setWidth(0);

    const t1 = setTimeout(() => setWidth(75), 50);
    const t2 = setTimeout(() => setWidth(100), 350);
    const t3 = setTimeout(() => setVisible(false), 650);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 z-[100] h-0.5 bg-orange-500 transition-all duration-300 ease-out"
      style={{ width: `${width}%` }}
    />
  );
}
