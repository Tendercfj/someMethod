// useEventSource.ts
import { ref, computed, Ref, ComputedRef,watch } from 'vue';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { EventSourceOptions, ConnectionState, UseEventSourceReturn } from './types';

export const useEventSource = (
  url: string,
  options: EventSourceOptions = {}
): UseEventSourceReturn => {
  const data = ref<any>(null);
  const connectionState = ref<ConnectionState>('disconnected');
  const error = ref<string | null>(null);
  const retryCount = ref(0);
  
  let controller: AbortController | null = null;

  const connect = async (): Promise<void> => {
    // 如果已有连接，先断开
    if (controller) {
      controller.abort();
    }
    
    controller = new AbortController();
    connectionState.value = 'connecting';
    error.value = null;
    retryCount.value = 0;

    const {
      method = 'GET',
      headers = {},
      body,
      withCredentials = false,
      openWhenHidden = true,
      retryInterval = 1000,
      maxRetries = 5,
      onopen,
      onmessage,
      onclose,
      onerror
    } = options;

    try {
      await fetchEventSource(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        credentials: withCredentials ? 'include' : 'same-origin',
        openWhenHidden,
        signal: controller.signal,

        async onopen(response) {
          connectionState.value = 'connected';
          retryCount.value = 0;
          
          if (onopen) {
            await onopen(response);
          }
          
          if (response.ok) {
            return;
          } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
            throw new Error(`Server error: ${response.status}`);
          } else {
            throw new Error(`Connection failed: ${response.status}`);
          }
        },

        onmessage(event) {
          try {
            // 尝试解析JSON数据
            let parsedData = event.data;
            try {
              parsedData = JSON.parse(event.data);
            } catch (e) {
              // 如果不是JSON，保持原样
            }
            
            data.value = parsedData;
            
            if (onmessage) {
              onmessage(parsedData, event);
            }
          } catch (err) {
            console.error('Error processing message:', err);
            if (onerror) {
              onerror(err, event);
            }
          }
        },

        onclose() {
          connectionState.value = 'disconnected';
          if (onclose) {
            onclose();
          }
        },

        onerror(err) {
          connectionState.value = 'error';
          error.value = err.message;
          
          if (retryCount.value < maxRetries) {
            connectionState.value = 'reconnecting';
            retryCount.value++;
            return retryInterval;
          }
          
          connectionState.value = 'disconnected';
          if (onerror) {
            onerror(err);
          }
          
          // 不再重试
          return null;
        },
      });
    } catch (err: any) {
      connectionState.value = 'error';
      error.value = err.message;
      if (onerror) {
        onerror(err);
      }
    }
  };

  const disconnect = (): void => {
    if (controller) {
      controller.abort();
      controller = null;
    }
    connectionState.value = 'disconnected';
  };

  const isConnected = computed(() => connectionState.value === 'connected');
  const isConnecting = computed(() => connectionState.value === 'connecting');
  const isReconnecting = computed(() => connectionState.value === 'reconnecting');

  // 自动重连逻辑
  watch(error, (newError) => {
    if (newError && retryCount.value < (options.maxRetries || 5)) {
      const timer = setTimeout(() => {
        connect();
      }, options.retryInterval || 1000);
      
      return () => clearTimeout(timer);
    }
  });

  return {
    data,
    connectionState,
    error,
    connect,
    disconnect,
    isConnected,
    isConnecting,
    isReconnecting,
  };
};