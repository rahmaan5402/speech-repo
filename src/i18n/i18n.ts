import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationZh from './locales/zh.json';
import translationEn from './locales/en.json';

const resources = {
  en: {
    translation: translationEn
  },
  zh: {
    translation: translationZh
  }
};

i18n
  // 使用浏览器语言检测
  .use(LanguageDetector)
  // 集成到React
  .use(initReactI18next)
  // 初始化配置
  .init({
    resources,
    // 默认语言
    fallbackLng: 'en',
    // 允许在翻译中使用HTML标签
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;