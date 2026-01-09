import { useEffect, useState } from 'react';
import { Observable } from 'rxjs';

/**
 * Hook para usar observables RxJS em componentes React
 * Gerencia automaticamente a subscrição e cleanup
 */
export function useObservable<T>(
  observable: Observable<T>,
  initialValue: T
): T {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    const subscription = observable.subscribe({
      next: (val) => setValue(val),
      error: (err) => console.error('Observable error:', err),
    });

    // Cleanup: cancela subscrição quando componente desmonta
    return () => subscription.unsubscribe();
  }, [observable]);

  return value;
}

/**
 * Hook para usar observables com loading state
 */
export function useObservableWithLoading<T>(
  observable: Observable<T>,
  initialValue: T
): [T, boolean, Error | null] {
  const [value, setValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const subscription = observable.subscribe({
      next: (val) => {
        setValue(val);
        setLoading(false);
      },
      error: (err) => {
        setError(err);
        setLoading(false);
        console.error('Observable error:', err);
      },
      complete: () => {
        setLoading(false);
      },
    });

    return () => subscription.unsubscribe();
  }, [observable]);

  return [value, loading, error];
}
