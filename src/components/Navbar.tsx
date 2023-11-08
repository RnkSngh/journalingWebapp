"use client";

import Link from "next/link";
import { useState } from "react";
import NavItem from "./NavItem";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const MENU_LIST = [
    { text: "Home", href: "/" },
    { text: "Submit", href: "/submit" },
    { text: "Lookup", href: "/lookup" },
  ];
  // const router = useRouter();

  return (
    <header>
      <nav className={`bg-[color:var(--background-secondary-color)]`}>
        <a href={"/"}>
          <p className="text-[color:var(--primary-color)] font-bold">
            {" "}
            ScribbleSwap{" "}
          </p>
        </a>
        <div
          className={` bg-[color:var(--background-secondary-color)] nav__menu-list`}
        >
          {MENU_LIST.map((menu, idx) => (
            <NavItem key={menu.text} {...menu} />
          ))}
        </div>
      </nav>
    </header>
  );
}
