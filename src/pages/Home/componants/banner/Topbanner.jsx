import React, { useEffect, useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import db, { auth } from "../../../../config/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
import Planet from "../planet/Planet";
import { collection, getDocs, query, where } from "firebase/firestore";

import { TranslateContext } from "../../../../TranslateContext/TransContext";
import { useTranslation } from "react-i18next";
import logoutbtn from "../../../../assets/logout.png";
import { TbLogout2 } from "react-icons/tb";
import saudiArabia from "../../../../assets/Flag_of_Saudi_Arabia.png";
import USA from "../../../../assets/Flag_of_the_United_States.png";
import { Navbar, Button } from "flowbite-react";

export default function Topbanner() {
  const navigate = useNavigate();
  const [topBannerUrl, setTopBannerUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const { handleChangeLanguage } = useContext(TranslateContext);
  const [user, setUser] = useState("");

  const { t, i18n } = useTranslation("global");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("lang") || "ar"
  );
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const q = query(
          collection(db, "users"),
          where("ID", "==", localStorage.getItem("id"))
        );
        const querySnapshot = await getDocs(q);
        const userData = querySnapshot.docs.map((doc) => doc.data());
        if (userData.length > 0) {
          setUser(userData[0]);
          // احفظ نوع الحساب في localStorage بحيث يكون متاحًا عند التنقل
          localStorage.setItem("accountType", userData[0].accountType);
        } else {
          console.log("No matching user found");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };
  
    fetchUser();
  }, []);
  

  const dropdownRef = useRef(null);

  useEffect(() => {

    const unsubscribeTopBanner = onSnapshot(doc(db, "banners", "topBanner"), (doc) => {
      if (doc.exists()) {
        setTopBannerUrl(doc.data().imageUrl);
      }
    });   const unsubscribeLogo = onSnapshot(doc(db, "banners", "logo"), (doc) => {
      if (doc.exists()) {
        setLogoUrl(doc.data().imageUrl);
      }
    });

    return () => {
      unsubscribeTopBanner();
      unsubscribeLogo();
    };
  }, []);


  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    handleChangeLanguage(lang);
    localStorage.setItem("lang", lang);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("id");
      await signOut(auth);
      navigate("/mycorgov", { replace: true });
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

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

  return (
    <div className="  " 

>
      {/* <Navbar
        fluid={true}
        rounded={true}
        className="bg-gray-500 text-white lg:hidden md:hidden"
      >
        <Navbar.Toggle className="bg-red text-yellow-50" />

        <Navbar.Collapse>
        {(localStorage.getItem("accountType") === "admin" || localStorage.getItem("accountType") === "superAdmin") && (
            <div
              className="relative cursor-pointer text-xl  rounded-full transition-all duration-300 group bg-slate-900 hover:bg-[#CDA03D] px-9 "
              onClick={() => navigate("/dashboard")}
            >

              <span className="block p-2 text-white">
                {t("text.DashBoard")}
              </span>
              
              
            </div>
          )}

          <div
            className="relative cursor-pointer text-xl  rounded-full transition-all duration-300 group bg-slate-900 hover:bg-[#CDA03D] px-9 "
            onClick={() => navigate("/users")}
          >
           
            <span className="block p-2 text-white">{t("text.Employees")}</span>
           
            
            
          </div>

          <div
            className="relative cursor-pointer text-xl rounded-full transition-all duration-300 group bg-slate-900 hover:bg-[#CDA03D] px-9 "
            onClick={() => navigate("/subjects")}
          >
           
            <span className="block p-2 text-white">{t("text.Articles")}</span>
       
          </div>

          <div
            className="relative cursor-pointer text-xl rounded-full transition-all duration-300 group bg-slate-900 hover:bg-[#CDA03D] px-9 "
            onClick={() => navigate("/Matrix")}
          >
           
            <span className="block p-2 text-white">{t("text.Matrices")}</span>
       
          </div>

          <div
            className="relative cursor-pointer text-xl rounded-full transition-all duration-300 group bg-slate-900 hover:bg-[#CDA03D] px-9 "
            onClick={() => navigate("/")}
          >
           
            <span className="block p-2 text-white">{t("text.home")}</span>
           
            
          </div>
        </Navbar.Collapse>
      </Navbar> */}

      {/* Banner section */}
      <div
  className="Topbaner w-full   h-36 rounded-xl bg-cover bg-center flex justify-between items-center"
  style={{ 
    backgroundImage: `url(${topBannerUrl})`,
    zIndex:"10",
    position: "fixed", 
    top: 0, 

  }}
>
  <div className="flex">

            <div className="relative mr-9 ml-9 " ref={dropdownRef}>
            <button
              className="p-2  bg-slate-400 border-yellow-400 border-2 text-white flex items-center hover:bg-slate-500"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <img
                src={selectedLanguage === "en" ? USA : saudiArabia}
                alt={selectedLanguage === "en" ? "English" : "Arabic"}
                className="w-6 h-6 mr-2"
              />
            </button>
            {isOpen && (
              <div className="absolute   bg-white shadow-lg   w-full">
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
          <div
              className="ml- font-semibold text-xl flex items-center justify-center text-gray-500  cursor-pointer hover:text-red-600 p-2 "
              onClick={handleLogout}
              style={{
                marginBottom: "10px",
              }}
            >
              <TbLogout2 size={30} />
            </div>
  </div>

  {/* Logo */}
  <div className="w-60 pr-5 pt-12 mb-12 ml-[300px] mr-[300px] logo">
    <Link to="/" className="">
      <img src={logoUrl} alt="Logo" />
    </Link>
  </div>
</div>

    </div>
  );
}
