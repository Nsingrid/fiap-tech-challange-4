import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { 
    id: "inicio", 
    label: "Início", 
    href: "/dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  { 
    id: "investimentos", 
    label: "Investimentos", 
    href: "/investimentos",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  },
];

export const SideMenu = () => {
  const pathname = usePathname();

  const getActiveId = () => {
    if (pathname === "/investimentos") return "investimentos";
    if (pathname === "/dashboard") return "inicio";
    return "inicio";
  };

  const activeId = getActiveId();

  return (
    <nav className="bg-white rounded-2xl border border-gray-100 p-4 sticky top-24">
      <ul className="space-y-2">
        {items.map(({ id, label, href, icon }) => {
          const isActive = activeId === id;
          
          return (
            <li key={id}>
              <Link
                href={href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${isActive 
                    ? 'bg-[#e8f5e9] text-[#4caf50]' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                {icon}
                <span className="font-medium text-sm">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
