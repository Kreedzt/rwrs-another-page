import React, {
  createContext,
  useState,
  useContext,
  useEffect,
} from 'preact/compat';
import { IntlProvider } from 'react-intl';

// Import language files
import enMessages from './locales/en.json';
import zhMessages from './locales/zh.json';
import {
  getInitialLocale,
  setDocumentLanguage,
  isValidLocale,
} from './languageUtils';

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
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Use the utility function to get the initial locale
  const [locale, setLocale] = useState(getInitialLocale());

  // Save locale to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('app-locale', locale);
    // Update html lang attribute using the utility function
    setDocumentLanguage(locale);
  }, [locale]);

  // Function to change the locale
  const changeLocale = (newLocale: string) => {
    if (isValidLocale(newLocale)) {
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
