import { ComponentType, useState, useEffect } from "react";

/**
 * Hook para Lazy Loading de componentes
 * Carrega componentes apenas quando necessário
 */
export function useLazyLoad<P extends object>(
  Component: ComponentType<P>,
  delay: number = 0
) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return { Component: isLoaded ? Component : null, isLoaded };
}

/**
 * Hook para Intersection Observer
 * Detecta quando um elemento entra em viewport
 */
export function useIntersectionObserver(ref: React.RefObject<HTMLElement>) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Para de observar após primeiro carregamento
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  return isVisible;
}

/**
 * Hook para Virtual Scrolling
 * Renderiza apenas itens visíveis em listas grandes
 */
export function useVirtualScroll(
  items: any[],
  itemHeight: number,
  containerHeight: number,
  bufferSize: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / itemHeight) - bufferSize
  );
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + bufferSize
  );

  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    startIndex,
    endIndex,
    offsetY,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    },
  };
}

/**
 * Hook para Debounce
 * Adia a execução de uma função até após um delay
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook para Throttle
 * Limita a frequência de execução de uma função
 */
export function useThrottle<T>(value: T, interval: number = 500): T {
  const [throttledValue, setThrottledValue] = useState(value);

  useEffect(() => {
    const handler = setInterval(() => {
      setThrottledValue(value);
    }, interval);

    return () => clearInterval(handler);
  }, [value, interval]);

  return throttledValue;
}
