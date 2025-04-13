import Home from './pages/home/index.tsx';
import './app.css';
import { Toaster } from './components/ui/toaster.tsx';
import { LanguageProvider } from './i18n/LanguageContext';

export function App() {
  return (
    <LanguageProvider>
      <div>
        <Home />
        <Toaster aria-label="Toaster" />
      </div>
    </LanguageProvider>
  );
}
