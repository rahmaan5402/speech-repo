import { HashRouter, useRoutes } from 'react-router-dom'
import router from './router';
import './App.css'
import 'sonner/dist/styles.css';

function AppRoutes() {
  return useRoutes(router);
}

function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}
export default App
