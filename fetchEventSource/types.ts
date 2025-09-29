// types.ts
import { Ref, ComputedRef } from 'vue';
export interface EventSourceOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  withCredentials?: boolean;
  openWhenHidden?: boolean;
  retryInterval?: number;
  maxRetries?: number;
  
  // 事件处理器
  onopen?: (response: Response) => void | Promise<void>;
  onmessage?: (data: any, event: MessageEvent) => void;
  onclose?: () => void;
  onerror?: (error: any, event?: Event) => number | null | void;
}

export type ConnectionState = 
  | 'disconnected' 
  | 'connecting' 
  | 'connected' 
  | 'reconnecting' 
  | 'error';

export interface UseEventSourceReturn {
  data: Ref<any>;
  connectionState: Ref<ConnectionState>;
  error: Ref<string | null>;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: ComputedRef<boolean>;
  isConnecting: ComputedRef<boolean>;
  isReconnecting: ComputedRef<boolean>;
}