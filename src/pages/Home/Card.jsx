import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"; 
import { getDownloadURL, ref } from "firebase/storage"; 
import { Card } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"; 
import db, { storage } from "../../config/firebase"; 
import "./Card.css";

export default function Cards() {
  const { t } = useTranslation("global");
  const [user, setUser] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndBanner = async () => {
      try {
        // Fetch user information
        const q = query(
          collection(db, "users"),
          where("ID", "==", localStorage.getItem("id"))
        );
        const querySnapshot = await getDocs(q);
        const userData = querySnapshot.docs.map((doc) => doc.data());
        
        if (userData.length > 0) {
          setUser(userData[0]);

          // Fetch the single banner image from banners collection
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

  return (
    <div className="flex justify-center items-center min-h-96 ">
      <div className="flex gap-4 items-center sm:p-4 flex-wrap justify-center">
        
        {/* Card 1 */}


        {/* Card 2 */}
        <div className="p-4 text-center relative bg-transparent w-64 card-container card-2"> 
          <img
            src={bannerUrl}  
            alt="Banner"
            className="inset-0 w-full h-full object-contain"
            
          />
          <button
            className="aux-button aux-medium aux-carmine-pink aux-curve aux-none aux-uppercase"
            onClick={() => navigate("/subjects")}
          >
            <h1 className="aux-text">
              {t("text.Articles")}
            </h1>
          </button>
        </div>

        {/* Card 3 */}
   
        <div className="p-4 text-center relative bg-transparent w-64 card-container card-3"> 
          <img
            src={bannerUrl }  
            alt="Banner"
            className="inset-0 w-full h-full object-contain"
            
          />
          <button
            className="aux-button aux-medium aux-carmine-pink aux-curve aux-none aux-uppercase"
            onClick={() => navigate("/Matrix")}
          >
            <h1 className="aux-text">
              {t("text.Matrices")}
            </h1>
          </button>
        </div>

        {/* Card 4 (Visible for admin only) */}
        {(user.accountType === "admin" || user.accountType === "superAdmin") && (
          <div className="p-4 text-center relative bg-transparent w-64 card-container card-4"> 
            <img
              src={bannerUrl } 
              alt="Banner"
              className="inset-0 w-full h-full object-contain"
              
            />
            <button
              className="aux-button aux-medium aux-carmine-pink aux-curve aux-none aux-uppercase"
              onClick={() => navigate("/dashboard")}
            >
              <h1 className="aux-text">
                {t("text.DashBoard")}
              </h1>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
