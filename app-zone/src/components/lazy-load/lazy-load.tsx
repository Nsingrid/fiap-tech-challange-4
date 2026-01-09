/**
 * Lazy Loading Wrapper
 * Componente otimizado para carregar componentes sob demanda
 */

'use client';

import { Suspense, lazy, ComponentType, LazyExoticComponent } from 'react';

interface LazyLoadProps {
  fallback?: React.ReactNode;
}

/**
 * HOC para lazy loading de componentes
 */
export function withLazyLoad<P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallback: React.ReactNode = <div className="animate-pulse">Carregando...</div>
): ComponentType<P> {
  const LazyComponent = lazy(importFunc);

  return function LazyLoadedComponent(props: P) {
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

/**
 * Componente genérico de loading skeleton
 */
export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}>
      <div className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
    </div>
  );
}

/**
 * Lazy load com intersection observer
 * Só carrega o componente quando visível na tela
 */
export function LazyLoadOnView({
  children,
  fallback = <LoadingSkeleton className="h-32" />,
  rootMargin = '50px',
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
}) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}
