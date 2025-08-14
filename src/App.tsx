import { HashRouter, useRoutes } from 'react-router-dom'
import router from './router';
import './App.css'
import 'sonner/dist/styles.css';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/i18n';

function AppRoutes() {
  return useRoutes(router);
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </I18nextProvider>
  );
}
export default App
