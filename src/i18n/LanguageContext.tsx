import React, { createContext, useState, useContext, useEffect } from 'preact/compat';
import { IntlProvider } from 'react-intl';

// Import language files
import enMessages from './locales/en.json';
import zhMessages from './locales/zh.json';

// Define available locales
export const locales = {
  en: 'English',
  zh: '中文',
};

// Define messages for each locale
const messages = {
  en: enMessages,
  zh: zhMessages,
};

// Define the type for the language context
type LanguageContextType = {
  locale: string;
  setLocale: (locale: string) => void;
  messages: Record<string, string>;
};

// Create the language context
const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: () => {},
  messages: messages.en,
});

// Language provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to get the locale from localStorage, default to browser language or 'en'
  const getBrowserLocale = () => {
    const browserLang = navigator.language.split('-')[0];
    return Object.keys(locales).includes(browserLang) ? browserLang : 'en';
  };

  const getInitialLocale = () => {
    const savedLocale = localStorage.getItem('app-locale');
    return savedLocale || getBrowserLocale();
  };

  const [locale, setLocale] = useState(getInitialLocale());

  // Save locale to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('app-locale', locale);
    // Update html lang attribute
    document.documentElement.lang = locale;
  }, [locale]);

  // Function to change the locale
  const changeLocale = (newLocale: string) => {
    if (Object.keys(locales).includes(newLocale)) {
      setLocale(newLocale);
    }
  };

  // Context value
  const value = {
    locale,
    setLocale: changeLocale,
    messages: messages[locale as keyof typeof messages],
  };

  return (
    <LanguageContext.Provider value={value}>
      <IntlProvider
        locale={locale}
        messages={messages[locale as keyof typeof messages]}
        defaultLocale="en"
      >
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);
