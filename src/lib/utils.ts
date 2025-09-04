import i18n from "@/i18n/i18n";
import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const toggleSidebar = (open: boolean) => {
  const event = new CustomEvent('speechToggleSidebar', { detail: { open } });
  window.dispatchEvent(event);
};

export const getElByShadowRoot = (id: string) => {
  const shadowRootContainer = document.getElementById('speech-extension-container');
  if (!shadowRootContainer) {
    return null;
  }
  const virtualShadowRoot = shadowRootContainer.shadowRoot;
  // 3. 查找挂载点
  return virtualShadowRoot.getElementById(id);
}

export async function handleBackgroundRequest<T = any>(
  action: string,
  data?: any
): Promise<T> {
  try {
    return await sendMessageToBackground<T>(action, data);
  } catch (error) {
    toast(i18n.t('action.toast.failure') + "，" + error.message, {
      action: {
        label: "OK",
        onClick: () => console.log("OK"),
      },
    });
  }
}

export const sendMessageToBackground = <T = any>(action: string, data?: any): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const requestId = `${Date.now()}-${Math.random().toString(36).substring(2)}`;

    const handler = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { responseId, responseData } = customEvent.detail || {};

      if (responseId === requestId) {
        window.removeEventListener('db_response', handler);
        if (responseData?.code !== 0) {
          reject(new Error(responseData.message));
        } else {
          resolve(responseData.data);
        }
      }
    };

    window.addEventListener('db_response', handler);

    // 派发事件给 content script
    const event = new CustomEvent('db_request', {
      detail: { requestId, action, data }
    });
    window.dispatchEvent(event);
  });
};

export class Result<T> {
  code: number;
  message: string;
  data?: T;

  // 私有构造函数，确保只能通过静态方法创建实例
  private constructor(code: number, message: string, data?: T) {
    this.code = code;
    this.message = message;
    this.data = data;
  }

  public static success<T>(data?: T): Result<T> {
    return new Result<T>(0, '操作成功', data);
  }

  // 可以添加错误返回方法
  public static error<T>(message: string): Result<T> {
    return new Result<T>(500, message, null);
  }
}

export const getFocusedInput = (): HTMLInputElement | HTMLTextAreaElement | null => {
  const el = document.activeElement;
  console.log("getFocusedInput el = ", el);
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    return el;
  }
  return null;
}