import { ElMessage } from "element-plus";

/**
 * 通用复制到剪贴板（支持对象自动序列化）
 * @param value 要复制的字符串 / 对象 / 数组
 */
export function useCopy(value: any): void {
  // 1. 统一转成字符串
  const text =
    typeof value === "string" ? value : JSON.stringify(value, null, 2);

  // 2. 创建临时输入框
  const input = document.createElement("textarea");
  input.value = text;
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);

  // 3. 选中并复制
  input.focus();
  input.select();
  input.setSelectionRange(0, text.length);

  let success = false;
  try {
    success = document.execCommand("copy");
  } catch {
    /* ignore */
  }

  // 4. 清理 DOM
  document.body.removeChild(input);

  // 5. 提示
  if (success) {
    ElMessage.success("复制成功");
  } else {
    ElMessage.error("复制失败，请手动复制");
  }
}
