import { ref } from "vue";
import { ElMessage } from "element-plus";

export interface UseLoadingOptions {
  onError?: (error: any) => void;
  errorMessage?: string;
}



/**
 * 
 * @param options 
 * @returns 
 * @description 封装一个useLoading方法，用于处理异步请求的loading状态，并提供错误处理机制，使得异 步请求的错误信息可以被全局统一处理，搭配骨架屏可以提升用户体验
 */
export function useLoading(options: UseLoadingOptions = {}) {
  const loading = ref(true);
  const error = ref<Error | null>(null);

  const initializeData = async (dataLoaders: (() => Promise<any>)[]) => {
    try {
      loading.value = true;
      error.value = null;

      // 并行加载所有数据
      await Promise.all(dataLoaders.map(loader => loader()));
    } catch (err) {
      error.value = err as Error;
      const errorMsg = options.errorMessage || "初始化数据失败";
      console.log(err);
      ElMessage.error(errorMsg);
      options.onError?.(err);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    initializeData
  };
}
