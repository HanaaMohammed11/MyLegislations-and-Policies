import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage"; 
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import db, { storage } from "../../config/firebase";
import "./Card.css";
import logo from "../../assets/logo-4 1.png";

export default function Cards({ setSelectedContent, toggleSidebar }) {
  const { t ,i18n} = useTranslation("global");
  const [user, setUser] = useState("");
  const [bannerUrl, setBannerUrl] = useState(""); 

  useEffect(() => {
    const fetchUserAndBanner = async () => {
      try {
        const q = query(
          collection(db, "users"),
          where("ID", "==", localStorage.getItem("id"))
        );
        const querySnapshot = await getDocs(q);
        const userData = querySnapshot.docs.map((doc) => doc.data());
        
        if (userData.length > 0) {
          setUser(userData[0]);

          const bannerDocRef = doc(db, "banners", "homeElements");
          const bannerDoc = await getDoc(bannerDocRef);
          
          if (bannerDoc.exists()) {
            const bannerData = bannerDoc.data();
            if (bannerData.imageUrl) {
              const imageRef = ref(storage, bannerData.imageUrl);
              const url = await getDownloadURL(imageRef);
              setBannerUrl(url); 
            }
          } else {
            console.log("No banner document found");
          }
        } else {
          console.log("No matching user found");
        }
      } catch (error) {
        console.error("Error fetching user or banner data: ", error);
      }
    };

    fetchUserAndBanner();
  }, []);
  const direction = i18n.language === "ar" ? "rtl" : "ltr";


  return (
    <div className="flex flex-col fixed " dir={direction} >
      {/* الشريط الجانبي المتجاوب */}
      <div className="fixed inset-y-0 w-64 bg-white h-screen z-40  sm:translate-x-0 sm:static">
        <div className="flex flex-col items-center p-4">
          <img src={logo} alt="Logo" className="mb-4" />

          <div className="p-4 text-center w-full max-w-xs card-container">
            <button
              className="aux-button aux-medium aux-carmine-pink aux-curve aux-none aux-uppercase w-full"
              onClick={() => { setSelectedContent("matrices"); toggleSidebar(); }}
            >
              <h1 className="aux-text">{t("text.Matrices")}</h1>
            </button>
          </div>

          <div className="p-4 text-center w-full max-w-xs card-container">
            <button
              className="aux-button aux-medium aux-carmine-pink aux-curve aux-none aux-uppercase w-full"
              onClick={() => { setSelectedContent("articles"); toggleSidebar(); }}
            >
              <h1 className="aux-text">{t("text.Articles")}</h1>
            </button>
          </div>


          {(user.accountType === "admin" || user.accountType === "superAdmin") && (
            <div className="p-4 text-center w-full max-w-xs card-container">
              <button
                className="aux-button aux-medium aux-carmine-pink aux-curve aux-none aux-uppercase w-full"
                onClick={() => { setSelectedContent("dashboard"); toggleSidebar(); }}
              >
                <h1 className="aux-text">{t("text.DashBoard")}</h1>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
