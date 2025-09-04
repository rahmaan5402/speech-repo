import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { getElByShadowRoot } from './lib/utils.ts';

// 监听扩展准备就绪事件
window.addEventListener('speechExtensionReady', (_e) => {
  // 查找挂载点
  const rootElement = getElByShadowRoot('speech-extension-root');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<App />);
  }
});

const ignoreList = [
  "AlertDialogContent",
  "DialogContent",
]

function shouldIgnore(message: any) {
  if (typeof message !== "string") return false
  return ignoreList.some((text) => message.includes(text))
}

// 捕捉 console.error
const originalError = console.error
console.error = (...args: any[]) => {
  if (shouldIgnore(args[0])) return
  originalError(...args)
}

// 捕捉 console.warn
const originalWarn = console.warn
console.warn = (...args: any[]) => {
  if (shouldIgnore(args[0])) return
  originalWarn(...args)
}