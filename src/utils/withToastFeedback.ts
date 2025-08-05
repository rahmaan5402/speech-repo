// utils/withToastFeedback.ts
import { toast } from "sonner"; // 或 "@/components/ui/use-toast" 根据你的项目而定

/**
 * 封装带 toast 提示的提交函数
 * @param submitFn 一个返回 boolean 的 async 函数
 * @param messages 可选的自定义消息
 */
export async function withToastFeedback(
  submitFn: () => Promise<boolean>,
  messages?: {
    successTitle?: string
    successDesc?: string
    errorTitle?: string
    errorDesc?: string
  }
) {
  const result = await submitFn();

  if (result) {
    toast(messages?.successTitle || "操作成功", {
      description: messages?.successDesc,
      action: {
        label: "OK",
        onClick: () => console.log("OK"),
      },
    });
  } else {
    toast(messages?.errorTitle  || "操作失败", {
      description: messages?.errorDesc,
      action: {
        label: "OK",
        onClick: () => console.log("OK"),
      },
    });
  }

  return result;
}
