<!-- EventSourceComponent.vue -->
<template>
  <slot
    :data="data"
    :connection-state="connectionState"
    :error="error"
    :connect="connect"
    :disconnect="disconnect"
    :is-connected="isConnected"
    :is-connecting="isConnecting"
    :is-reconnecting="isReconnecting"
  />
</template>

<script setup lang="ts">
import { defineProps, onUnmounted, watch } from "vue";
import { useEventSource } from "./useEventSource";
import { EventSourceOptions } from "./types";

const props = defineProps<{
  url: string;
  options?: EventSourceOptions;
  autoConnect?: boolean;
}>();

const {
  data,
  connectionState,
  error,
  connect,
  disconnect,
  isConnected,
  isConnecting,
  isReconnecting,
} = useEventSource(props.url, props.options);

// 自动连接
watch(
  () => props.autoConnect,
  (newVal) => {
    if (newVal) {
      connect();
    } else {
      disconnect();
    }
  },
  { immediate: true }
);

// URL变化时重新连接
watch(
  () => props.url,
  (newUrl, oldUrl) => {
    if (newUrl !== oldUrl) {
      disconnect();
      connect();
    }
  }
);

// 清理连接
onUnmounted(() => {
  disconnect();
});
</script>
