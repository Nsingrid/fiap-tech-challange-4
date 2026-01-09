"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useClickOutside } from "~/hooks/useClickOutside";

export type InvestmentItem = {
  code: string;
  name: string;
  description: string;
  riskLevel: string;
  liquidity: string;
};

export type InvestmentSubcategory = {
  id: string;
  name: string;
  items: InvestmentItem[];
};

export type InvestmentCategory = {
  id: string;
  name: string;
  description: string;
  subcategories: InvestmentSubcategory[];
};

export type InvestmentSelectorProps = {
  label: string;
  categories: InvestmentCategory[];
  onSelect: (investment: InvestmentItem, categoryId: string) => void;
  disabled?: boolean;
  selected?: InvestmentItem | null;
};

export const InvestmentSelector = ({
  label,
  categories,
  onSelect,
  disabled = false,
  selected = null,
}: InvestmentSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calcular posição do dropdown quando abrir
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownMaxHeight = 384; // max-h-96 = 384px
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // Se não há espaço suficiente abaixo, abrir acima
      const shouldOpenAbove = spaceBelow < dropdownMaxHeight && spaceAbove > spaceBelow;
      
      setDropdownStyle({
        position: 'fixed',
        top: shouldOpenAbove ? `${rect.top - dropdownMaxHeight - 8}px` : `${rect.bottom + 8}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
      });
    }
  }, [isOpen]);

  // Click outside handler customizado para incluir o dropdown no portal
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current && !containerRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Filtrar investimentos baseado na busca
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;

    const search = searchTerm.toLowerCase();
    return categories
      .map((category) => ({
        ...category,
        subcategories: category.subcategories
          .map((subcategory) => ({
            ...subcategory,
            items: subcategory.items.filter(
              (item) =>
                item.name.toLowerCase().includes(search) ||
                item.description.toLowerCase().includes(search) ||
                category.name.toLowerCase().includes(search) ||
                subcategory.name.toLowerCase().includes(search)
            ),
          }))
          .filter((subcategory) => subcategory.items.length > 0),
      }))
      .filter((category) => category.subcategories.length > 0);
  }, [categories, searchTerm]);

  // Auto-expandir categorias quando houver busca
  useEffect(() => {
    if (searchTerm) {
      const allCategoryIds = filteredCategories.map(c => c.id);
      setExpandedCategories(new Set(allCategoryIds));
    } else {
      setExpandedCategories(new Set());
    }
  }, [searchTerm, filteredCategories]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const handleSelect = (item: InvestmentItem, categoryId: string) => {
    onSelect(item, categoryId);
    setIsOpen(false);
    setSearchTerm("");
  };

  const getRiskColor = (risk: string) => {
    const colors: Record<string, string> = {
      BAIXO: "text-green-600 bg-green-100",
      MEDIO: "text-yellow-600 bg-yellow-100",
      ALTO: "text-orange-600 bg-orange-100",
      MUITO_ALTO: "text-red-600 bg-red-100",
    };
    return colors[risk] || "text-gray-600 bg-gray-100";
  };

  const getRiskLabel = (risk: string) => {
    const labels: Record<string, string> = {
      BAIXO: "Baixo",
      MEDIO: "Médio",
      ALTO: "Alto",
      MUITO_ALTO: "Muito Alto",
    };
    return labels[risk] || risk;
  };

  return (
    <>
      <div ref={containerRef} className="relative mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>

        {/* Trigger Button */}
        <button
          ref={buttonRef}
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full px-4 py-3 text-left bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
            disabled
              ? "bg-gray-100 cursor-not-allowed text-gray-500"
              : "hover:border-gray-400 cursor-pointer"
          } ${selected ? "text-gray-900" : "text-gray-500"}`}
        >
          <div className="flex items-center justify-between">
            <span className="truncate">
              {selected ? selected.name : "Selecione um investimento"}
            </span>
            <svg
              className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && mounted && createPortal(
        <div 
          ref={dropdownRef}
          style={{ ...dropdownStyle, zIndex: 9000 }}
          className="bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-hidden"
        >
          {/* Search Bar */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-3 z-10">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar investimento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Categories List */}
          <div className="overflow-y-auto max-h-80">
            {filteredCategories.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm">Nenhum investimento encontrado</p>
              </div>
            ) : (
              filteredCategories.map((category) => (
                <div key={category.id} className="border-b border-gray-100 last:border-b-0">
                  {/* Category Header */}
                  <button
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900">{category.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{category.description}</p>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedCategories.has(category.id) ? "rotate-90" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Subcategories */}
                  {expandedCategories.has(category.id) && (
                    <div className="bg-gray-50">
                      {category.subcategories.map((subcategory) => (
                        <div key={subcategory.id} className="border-t border-gray-200">
                          <div className="px-4 py-2 bg-gray-100">
                            <h5 className="text-sm font-medium text-gray-700">{subcategory.name}</h5>
                          </div>
                          <div className="divide-y divide-gray-200">
                            {subcategory.items.map((item) => (
                              <button
                                key={item.code}
                                type="button"
                                onClick={() => handleSelect(item, category.id)}
                                className="w-full px-4 py-3 hover:bg-white transition-colors text-left"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                      {item.description}
                                    </p>
                                  </div>
                                  <span
                                    className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getRiskColor(
                                      item.riskLevel
                                    )}`}
                                  >
                                    {getRiskLabel(item.riskLevel)}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
