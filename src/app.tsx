import Home from './pages/home/index.tsx';
import './app.css';
import { Toaster } from './components/ui/toaster.tsx';

export function App() {
  return (
    <div>
      <Home />
      <Toaster />
    </div>
  );
}
