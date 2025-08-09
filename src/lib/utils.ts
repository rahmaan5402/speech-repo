import { clsx, type ClassValue } from "clsx"
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

export const sendMessageToBackground = <T = any>(action: string, data?: any): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const requestId = `${Date.now()}-${Math.random().toString(36).substring(2)}`;

    const handler = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { responseId, responseData, error } = customEvent.detail || {};

      if (responseId === requestId) {
        window.removeEventListener('db_response', handler);
        if (error) {
          console.log("sendMessageToBackground error = ", error);
          reject(new Error(error));
        } else {
          resolve(responseData);
        }
      }
    };

    window.addEventListener('db_response', handler);

    // 派发事件给 content script
    const event = new CustomEvent('db_message', {
      detail: { requestId, action, data }
    });
    window.dispatchEvent(event);
  });
};
