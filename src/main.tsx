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