/**
 * Reactive State Service - Gerenciamento de estado reativo usando RxJS
 * Permite observar mudanças de estado em tempo real
 */

import { BehaviorSubject, Observable, Subject, debounceTime, distinctUntilChanged, map } from 'rxjs';

interface User {
  id: string;
  name: string;
  email: string;
  balance?: number;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'transfer' | 'investment';
  amount: number;
  date: string;
  description: string;
}

interface AppState {
  user: User | null;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

class ReactiveStateService {
  // Estado inicial
  private initialState: AppState = {
    user: null,
    transactions: [],
    loading: false,
    error: null,
  };

  // BehaviorSubject mantém o estado atual e emite para novos subscribers
  private stateSubject = new BehaviorSubject<AppState>(this.initialState);

  // Subject para ações (programação reativa baseada em eventos)
  private actionsSubject = new Subject<{ type: string; payload?: any }>();

  // Observable público do estado (read-only)
  public state$ = this.stateSubject.asObservable();

  // Observables específicos para partes do estado
  public user$ = this.state$.pipe(
    map(state => state.user),
    distinctUntilChanged()
  );

  public transactions$ = this.state$.pipe(
    map(state => state.transactions),
    distinctUntilChanged()
  );

  public loading$ = this.state$.pipe(
    map(state => state.loading),
    distinctUntilChanged()
  );

  public error$ = this.state$.pipe(
    map(state => state.error),
    distinctUntilChanged()
  );

  // Observable do balance calculado reativo
  public balance$ = this.transactions$.pipe(
    map(transactions => 
      transactions.reduce((acc, t) => {
        if (t.type === 'deposit') return acc + t.amount;
        if (t.type === 'withdraw') return acc - t.amount;
        return acc;
      }, 0)
    ),
    distinctUntilChanged()
  );

  constructor() {
    this.setupActionHandlers();
  }

  /**
   * Configura handlers para ações
   */
  private setupActionHandlers(): void {
    this.actionsSubject
      .pipe(debounceTime(100)) // Evita updates muito frequentes
      .subscribe(action => {
        const currentState = this.stateSubject.value;
        let newState = { ...currentState };

        switch (action.type) {
          case 'SET_USER':
            newState.user = action.payload;
            break;
          case 'SET_TRANSACTIONS':
            newState.transactions = action.payload;
            break;
          case 'ADD_TRANSACTION':
            newState.transactions = [...currentState.transactions, action.payload];
            break;
          case 'SET_LOADING':
            newState.loading = action.payload;
            break;
          case 'SET_ERROR':
            newState.error = action.payload;
            break;
          case 'CLEAR_ERROR':
            newState.error = null;
            break;
          case 'RESET':
            newState = this.initialState;
            break;
        }

        this.stateSubject.next(newState);
      });
  }

  /**
   * Despacha uma ação
   */
  dispatch(type: string, payload?: any): void {
    this.actionsSubject.next({ type, payload });
  }

  /**
   * Obtém o estado atual (snapshot)
   */
  getState(): AppState {
    return this.stateSubject.value;
  }

  /**
   * Define o usuário
   */
  setUser(user: User | null): void {
    this.dispatch('SET_USER', user);
  }

  /**
   * Define transações
   */
  setTransactions(transactions: Transaction[]): void {
    this.dispatch('SET_TRANSACTIONS', transactions);
  }

  /**
   * Adiciona nova transação
   */
  addTransaction(transaction: Transaction): void {
    this.dispatch('ADD_TRANSACTION', transaction);
  }

  /**
   * Define estado de loading
   */
  setLoading(loading: boolean): void {
    this.dispatch('SET_LOADING', loading);
  }

  /**
   * Define erro
   */
  setError(error: string): void {
    this.dispatch('SET_ERROR', error);
  }

  /**
   * Limpa erro
   */
  clearError(): void {
    this.dispatch('CLEAR_ERROR');
  }

  /**
   * Reseta estado
   */
  reset(): void {
    this.dispatch('RESET');
  }

  /**
   * Cria um observable customizado do estado
   */
  select<K extends keyof AppState>(key: K): Observable<AppState[K]> {
    return this.state$.pipe(
      map(state => state[key]),
      distinctUntilChanged()
    );
  }
}

// Instância singleton
export const reactiveState = new ReactiveStateService();

// Hook para usar em React
export function useReactiveState() {
  return reactiveState;
}
