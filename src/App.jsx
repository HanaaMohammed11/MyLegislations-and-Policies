import React, { useContext, useEffect, useRef, useState } from "react";
import logo from "../../../src/assets/logo1.png"
import saudiArabia from "../../../src/assets//Flag_of_Saudi_Arabia.png";
import USA from "../../../src/assets//Flag_of_the_United_States.png";
import "./FormStyle.css";

import { TranslateContext } from "../../TranslateContext/TransContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
function IntroPage() {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation("global");

    const dropdownRef = useRef(null);
    const { handleChangeLanguage } = useContext(TranslateContext);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(
      localStorage.getItem("lang") || "ar"
    );
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
    const handleLanguageSelect = (lang) => {
      setSelectedLanguage(lang);
      handleChangeLanguage(lang);
      localStorage.setItem("lang", lang);
      setIsOpen(false);
    };
    const direction = i18n.language === "ar" ? "rtl" : "ltr";

  return (
    <div className="min-h-screen bg-gradient-radial flex flex-col items-center   text-center" dir={direction}>
      {/* الشعار */}
      <header className="w-full flex justify-between px-10 py-9">
        <img src={logo} alt="Logo" className="w-16 h-16" /> 
        <h1 className="text-lg font-medium ">MyCorgov</h1>
     
        <div className="relative " ref={dropdownRef}>
            <button
              className="p-2   border-yellow-400 border-2 text-white flex items-center hover:bg-slate-500"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <img
                src={selectedLanguage === "en" ? USA : saudiArabia}
                alt={selectedLanguage === "en" ? "English" : "Arabic"}
                className="w-6 h-6 mr-2"
              />
            </button>
            {isOpen && (
              <div className="absolute  z-[2200] bg-white shadow-lg   w-full">
                <div
                  onClick={() => handleLanguageSelect("en")}
                  className="p-2 flex items-center cursor-pointer hover:bg-gray-100"
                >
                  <img src={USA} alt="USA Flag" className="w-6 h-6 mr-2" />
                </div>
                <div
                  onClick={() => handleLanguageSelect("ar")}
                  className="p-2 flex items-center cursor-pointer hover:bg-gray-100"
                >
                  <img
                    src={saudiArabia}
                    alt="Saudi Arabia Flag"
                    className="w-6 h-6 mr-2"
                  />
                </div>
              </div>
            )}
          </div>
   
 
      </header>

      {/* المحتوى الرئيسي */}
      <main className="flex flex-col items-center justify-center px-14 my-auto space-y-4 ">
        <div className=" ">

        <h2 className="lg:text-7xl md:text-7xl sm:text-3xl  text-3xl font-semibold text-[#8E6505] lg:mb-4">   {t("intropage.header")}
        </h2>
        </div>
        <p className="text-gray-500 max-w-screen-lg lg:text-2xl md:text-2xl sm:text-xl  text-xl ">
   
   {t("intropage.content")}
        </p>
        <button onClick={()=>{navigate("/login")}} className="w-44 mt-8 px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:border-gray-700">
        
          <span className="text-yellow-600 text-xl font-semibold" dir={direction}> {t("login.loginButton")} →</span>
        </button>
      </main>
    </div>
  );
}

export default IntroPage;
