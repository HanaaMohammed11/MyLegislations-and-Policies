import { createContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

const TranslateContext = createContext();

function TranslateProvider({ children }) {
  const { i18n } = useTranslation("global");

  function handleChangeLanguage(lang) {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  }

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "ar"; 
    i18n.changeLanguage(lang);
  }, [i18n]);

  return (
    <TranslateContext.Provider value={{ handleChangeLanguage }}>
      {children}
    </TranslateContext.Provider>
  );
}

export { TranslateContext, TranslateProvider };
