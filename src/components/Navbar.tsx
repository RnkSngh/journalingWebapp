"use client";

import NavItem from "./NavItem";
import { Text } from "@chakra-ui/layout";

export default function Navbar() {
  const MENU_LIST = [
    { text: "Home", href: "/" },
    { text: "Submit", href: "/submit" },
    { text: "Lookup", href: "/lookup" },
  ];

  return (
    <header>
      <nav className={`bg-[color:var(--background-secondary-color)]`}>
        <a href={"/"}>
          <Text className="text-[color:var(--primary-color)] font-bold">
            {" "}
            ScribbleSwap v0.1{" "}
          </Text>
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
