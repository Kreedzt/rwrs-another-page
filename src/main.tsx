import { render } from 'preact';
import './index.css';
import { App } from './app.tsx';
import { initializeLanguage } from './i18n/languageUtils';

// Initialize language before rendering the app
initializeLanguage();

render(<App />, document.getElementById('app')!);
