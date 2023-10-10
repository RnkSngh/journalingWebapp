import { Url } from "next/dist/shared/lib/router/router";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavBarProps {
  text: String;
  href: Url;
}

export default function NavItem(props: NavBarProps) {
  const { text, href } = props;
  const pathName = usePathname();
  console.log("pathname", pathName, href);

  return (
    <Link
      href={href}
      className={`bg-[color:var(--background-secondary-color)]`}
    >
      {text}
    </Link>
  );
}
