import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

/**
 * Hook para monitorar e otimizar performance da aplicação
 * Implementa Core Web Vitals monitoring
 */
export function usePerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    const metrics: PerformanceMetrics = {};

    // Monitora Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
        
        if (metrics.lcp && metrics.lcp > 2500) {
          console.warn('⚠️ LCP lento:', metrics.lcp, 'ms');
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // LCP não suportado
    }

    // Monitora First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          metrics.fid = entry.processingStart - entry.startTime;
          
          if (metrics.fid && metrics.fid > 100) {
            console.warn('⚠️ FID lento:', metrics.fid, 'ms');
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      // FID não suportado
    }

    // Monitora Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            metrics.cls = clsValue;
            
            if (clsValue > 0.1) {
              console.warn('⚠️ CLS alto:', clsValue);
            }
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      // CLS não suportado
    }

    // Monitora Navigation Timing
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      metrics.ttfb = timing.responseStart - timing.requestStart;
      metrics.fcp = timing.domContentLoadedEventEnd - timing.navigationStart;
      
      console.log('📊 Performance Metrics:', metrics);
    }

    // Cleanup
    return () => {
      // Observers são automaticamente desconectados quando a página é fechada
    };
  }, []);

  /**
   * Marca um ponto de performance customizado
   */
  const markPerformance = useCallback((markName: string) => {
    if (typeof window !== 'undefined' && window.performance && window.performance.mark) {
      try {
        window.performance.mark(markName);
      } catch (e) {
        console.warn('Erro ao marcar performance:', e);
      }
    }
  }, []);

  /**
   * Mede tempo entre duas marcas
   */
  const measurePerformance = useCallback((measureName: string, startMark: string, endMark: string) => {
    if (typeof window !== 'undefined' && window.performance && window.performance.measure) {
      try {
        window.performance.measure(measureName, startMark, endMark);
        
        const measure = window.performance.getEntriesByName(measureName)[0];
        console.log(`⏱️ ${measureName}: ${measure.duration.toFixed(2)}ms`);
        
        return measure.duration;
      } catch (e) {
        console.warn('Erro ao medir performance:', e);
        return 0;
      }
    }
    return 0;
  }, []);

  return {
    markPerformance,
    measurePerformance,
  };
}
