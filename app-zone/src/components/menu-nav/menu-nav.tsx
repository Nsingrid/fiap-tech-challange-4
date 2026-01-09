import Link from "next/link";
import { useRef, useState } from "react";
import { useClickOutside } from "~/hooks/useClickOutside";
import { useWindowWidth } from "~/hooks/useWindowWidth";
import { Button } from "../button/button";
import { VectorImage } from "../vector-image/vector-image";

export type MenuNavProps = Readonly<{
  items: Array<{
    label: string;
  }>;
}>;

export const MenuNav = ({ items }: MenuNavProps) => {
  const windowWidth = useWindowWidth();
  const ref = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useClickOutside(ref, isModalOpen, () => setIsModalOpen(false));

  return (
    <nav className="flex items-center">
      {windowWidth <= 360 ? (
        <Button
          variant="ghost"
          size="ghost"
          onClick={() => setIsModalOpen(true)}
        >
          <VectorImage name="icon-menu" />
        </Button>
      ) : (
        <ul className="flex items-center gap-2">
          {items.map((item, index) => (
            <li key={index}>
              <Link 
                href="#" 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {isModalOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsModalOpen(false)}
          />
          <div 
            ref={ref}
            className="fixed top-0 right-0 bottom-0 w-64 bg-white z-50 shadow-2xl p-6 animate-slide-up"
          >
            <div className="flex justify-end mb-6">
              <Button
                variant="ghost"
                size="ghost"
                onClick={() => setIsModalOpen(false)}
              >
                <VectorImage name="icon-close" />
              </Button>
            </div>
            <ul className="space-y-3">
              {items.map((item, index) => (
                <li key={index}>
                  <Link 
                    href="#" 
                    className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </nav>
  );
};
