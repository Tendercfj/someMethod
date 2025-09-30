import { ref, reactive } from "vue";

export interface PaginationOptions {
  size?: number;
  current?: number;
  total?: number;
}

/**
 *
 * @param fetchFn 获取table数据的api方法
 * @param initialParams 初始化参数
 * @param options 分页参数
 * @returns
 */

export function usePagination<T = any>(
  fetchFn: (params: any) => Promise<{ records: T[]; total: number }>,
  initialParams: Record<string, any> = {},
  options: PaginationOptions = {}
) {
  const loading = ref(false);
  const data = ref<T[]>([]);
  const pagination = reactive({
    current: options.current || 1,
    size: options.size || 10,
    total: options.total || 0
  });
  const params = reactive({ ...initialParams });

  // 统一获取数据
  const fetchData = async (extraParams: Record<string, any> = {}) => {
    loading.value = true;
    try {
      const query = {
        ...params,
        ...extraParams,
        pageNumber: pagination.current,
        pageCount: pagination.size
      };
      const result = await fetchFn(query);
      data.value = result.records;
      pagination.total = result.total;
    } catch (e) {
      console.log(e);
      data.value = [];
      pagination.total = 0;
    } finally {
      loading.value = false;
    }
  };

  // 页码变更
  const handleCurrentChange = (page: number) => {
    pagination.current = page;
    fetchData();
  };

  // 每页数量变更
  const handleSizeChange = (size: number) => {
    pagination.size = size;
    pagination.current = 1;
    fetchData();
  };

  return {
    data,
    loading,
    pagination,
    fetchData,
    handleCurrentChange,
    handleSizeChange,
    params
  };
}
