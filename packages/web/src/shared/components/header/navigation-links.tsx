import Link from "next/link";

interface NavigationLinksProps {
  isLandingPage: boolean;
  className?: string;
}

const landingLinks = [
  { href: "#inicio", label: "Início" },
  { href: "#produtos", label: "Produtos" },
  { href: "#sobre", label: "Sobre" },
  { href: "#contato", label: "Contato" },
];

const appLinks = [
  { href: "/dashboard", label: "Início" },
  { href: "/perfil", label: "Perfil" },
  { href: "/curriculo", label: "Currículo" },
];

export const NavigationLinks = ({
  isLandingPage,
  className,
}: NavigationLinksProps) => {
  const links = isLandingPage ? landingLinks : appLinks;

  return (
    <>
      {links.map((link) => (
        <li key={link.label}>
          <Link href={link.href} className={className}>
            {link.label}
          </Link>
        </li>
      ))}
    </>
  );
};
