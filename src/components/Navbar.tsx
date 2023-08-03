"use client";

import Link from "next/link"
import { useState } from "react"
import NavItem from "./NavItem";

export default function Navbar() {

    const [navActive, setNavActive] = useState(false);
    const [activeIdx, setActiveIdx] = useState(-1);

    const MENU_LIST = [
        {text:"Home", href: "/"},
        {text:"Submit", href: "/submit"},
        {text:"Lookup", href: "/lookup"},
        ]

    return <header> 
        <nav className={`bg-[color:var(--background-secondary-color)]`}>
            <Link href={"/"}>
                <h1 className="text-[color:var(--primary-color)] font-bold" > ScribbleSwap </h1>
            </Link>
            <div onClick={()=> setNavActive(!navActive)} className={`nav__menu-bar`}>
            </div>
            <div className={`${navActive? "active" : ""} bg-[color:var(--background-secondary-color)] nav__menu-list`}>
                {MENU_LIST.map((menu, idx)=>(
                <div onClick={()=>{
                        setActiveIdx(idx);
                        setNavActive(false);
                    }}
                    key={menu.text}
                >
                    <NavItem active={activeIdx === idx} {...menu}/>
                </div>
                ))}
            </div>
             </nav>
    </header>
}