import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useClickOutside } from "~/hooks/useClickOutside";
import type { DropdownOption } from "~/models/dropdown-option.model";
import { VectorImage } from "../vector-image/vector-image";

export type DropdownProps = Readonly<{
  label: string;
  options: DropdownOption[];
  onSelect?: (option: DropdownOption) => void;
  disabled?: boolean;
}>;

export const Dropdown = ({ label, options, onSelect, disabled = false }: DropdownProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<DropdownOption | null>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: `${rect.bottom + 8}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
      });
    }
  }, [open]);

  // Click outside handler customizado para incluir o dropdown no portal
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        ref.current && !ref.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const toggleOpen = () => {
    if (!disabled) {
      setOpen((prev) => !prev);
    }
  };

  const handleSelect = (option: DropdownOption) => {
    if (disabled) return;
    
    options.forEach((opt) => {
      opt.selected = false;
    });

    option.selected = true;
    setSelected(option);
    setOpen(false);
    if (onSelect) {
      onSelect(option);
    }
  };

  return (
    <>
      <div className={`relative mb-4 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} ref={ref}>
        <div
          ref={buttonRef}
          className={`
            flex items-center justify-between px-4 py-3 bg-white border-2 rounded-lg cursor-pointer transition-all
            ${open ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-300 hover:border-gray-400'}
            ${disabled ? 'pointer-events-none' : ''}
          `}
          onClick={toggleOpen}
          tabIndex={disabled ? -1 : 0}
        >
          <span className={`text-sm font-medium ${selected ? 'text-gray-900' : 'text-gray-500'}`}>
            {selected ? selected.label : label}
          </span>
          <div className={`transform transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
            <VectorImage name="icon-arrow-down" />
          </div>
        </div>
      </div>
      {open && mounted && createPortal(
        <ul 
          ref={dropdownRef}
          style={{ ...dropdownStyle, zIndex: 9000 }}
          className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto animate-fade-in"
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              className={`px-4 py-3 cursor-pointer transition-colors hover:bg-primary-50 ${
                opt?.selected ? 'bg-primary-100 font-semibold text-primary-900' : 'text-gray-700'
              }`}
              onClick={() => handleSelect(opt)}
            >
              {opt.label}
            </li>
          ))}
        </ul>,
        document.body
      )}
    </>
  );
};
