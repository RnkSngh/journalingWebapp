import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";

interface NavBarProps {
  text: String;
  href: Url;
  active: Boolean;
}

export default function NavItem(props: NavBarProps){
  
  const {text, active, href} = props;

  return (
    <Link href={href} className={`bg-[color:var(--background-secondary-color)]`}>
      {" "}
      <h1 className={`nav__item ${active? "active" : ""}`}> {text} </h1>
    </Link>
  );
};
