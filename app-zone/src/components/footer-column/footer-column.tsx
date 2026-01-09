import Link from "next/link";

export type FooterColumnItem = {
  label: string;
  href: string;
};

export type FooterColumnProps = Readonly<{
  title: string;
  items: FooterColumnItem[];
}>;

export const FooterColumn = ({ title, items }: FooterColumnProps) => (
  <div className="flex flex-col space-y-3">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <ul className="space-y-2">
      {items.map(({ label, href }) => (
        <li key={label}>
          <Link 
            href={href} 
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);
