/**
 * Optimized Loading Component
 * Loading skeleton otimizado para melhor UX
 */

import styles from './optimized-loading.module.css';

interface OptimizedLoadingProps {
  variant?: 'card' | 'list' | 'text' | 'full';
  lines?: number;
  className?: string;
}

export function OptimizedLoading({ 
  variant = 'card', 
  lines = 3,
  className = '' 
}: OptimizedLoadingProps) {
  if (variant === 'full') {
    return (
      <div className={`${styles.fullLoading} ${className}`}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>Carregando...</p>
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`${styles.textLoading} ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div 
            key={i} 
            className={styles.textLine}
            style={{ width: `${100 - (i * 10)}%` }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={`${styles.listLoading} ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className={styles.listItem}>
            <div className={styles.listAvatar} />
            <div className={styles.listContent}>
              <div className={styles.listTitle} />
              <div className={styles.listSubtitle} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Card variant (default)
  return (
    <div className={`${styles.cardLoading} ${className}`}>
      <div className={styles.cardImage} />
      <div className={styles.cardContent}>
        <div className={styles.cardTitle} />
        <div className={styles.cardSubtitle} />
        <div className={styles.cardText} />
      </div>
    </div>
  );
}
