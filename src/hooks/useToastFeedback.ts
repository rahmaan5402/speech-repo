// 重命名文件为 useToastFeedback.ts 并修改内容
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

/**
 * 自定义钩子：封装带 toast 提示的提交函数
 * @returns 一个带 toast 提示的异步提交函数
 */
export function useToastFeedback() {
  const { t } = useTranslation();

  /**
   * 执行带 toast 提示的提交操作
   * @param submitFn 一个返回 boolean 的 async 函数
   * @param messages 可选的自定义消息
   */
  const executeWithToast = async (
    submitFn: () => Promise<boolean>,
    messages?: {
      successTitle?: string
      successDesc?: string
      errorTitle?: string
      errorDesc?: string
    }
  ) => {
    const result = await submitFn();

    if (result) {
      toast(messages?.successTitle || t('action.toast.success'), {
        description: messages?.successDesc,
        action: {
          label: "OK",
          onClick: () => console.log("OK"),
        },
      });
    } else {
      toast(messages?.errorTitle || t('action.toast.failure'), {
        description: messages?.errorDesc,
        action: {
          label: "OK",
          onClick: () => console.log("OK"),
        },
      });
    }

    return result;
  };

  return executeWithToast;
}