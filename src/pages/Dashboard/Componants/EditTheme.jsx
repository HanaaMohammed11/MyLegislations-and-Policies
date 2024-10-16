/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import db, { storage } from "../../../config/firebase"; // تأكد من تصدير 'storage' بشكل صحيح
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { FileInput, Label } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../../Home/Card.css";
const EditTheme = () => {
  const { t, i18n } = useTranslation("global");
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const [topBanner, setTopBanner] = useState(null);
  const [bottomBanner, setBottomBanner] = useState(null);
  const [homeElements, setHomeElements] = useState(null);
  const [logo, setLogo] = useState(null);

  const [homeElementsUrl, setHomeElementsUrl] = useState("");
  const [topBannerUrl, setTopBannerUrl] = useState("");
  const [bottomBannerUrl, setBottomBannerUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const [topBannerPreview, setTopBannerPreview] = useState("");
  const [bottomBannerPreview, setBottomBannerPreview] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [homeElementsPreview, setHomeElementsPreview] = useState("");

  useEffect(() => {
    const unsubscribeTopBanner = onSnapshot(
      doc(db, "banners", "topBanner"),
      (doc) => {
        if (doc.exists()) {
          setTopBannerUrl(doc.data().imageUrl || "");
        }
      }
    );

    const unsubscribeBottomBanner = onSnapshot(
      doc(db, "banners", "bottomBanner"),
      (doc) => {
        if (doc.exists()) {
          setBottomBannerUrl(doc.data().imageUrl || "");
        }
      }
    );

    const unsubscribeLogo = onSnapshot(doc(db, "banners", "logo"), (doc) => {
      if (doc.exists()) {
        setLogoUrl(doc.data().imageUrl || "");
      }
    });

    const unsubscribeHomeElements = onSnapshot(
      doc(db, "banners", "homeElements"),
      (doc) => {
        if (doc.exists()) {
          setHomeElementsUrl(doc.data().imageUrl || "");
        }
      }
    );

    return () => {
      unsubscribeTopBanner();
      unsubscribeBottomBanner();
      unsubscribeLogo();
      unsubscribeHomeElements();
    };
  }, []);

  // دالة لحذف الصورة القديمة وتحديث Firestore
  const handleDeleteImage = async (
    storagePath,
    setPreview,
    setFile,
    setUrl
  ) => {
    try {
      const fullStoragePath = `banners/${storagePath}`;
      await deleteOldImage(fullStoragePath);

      // تحديث Firestore لإزالة imageUrl
      await setDoc(
        doc(db, "banners", storagePath),
        { imageUrl: "" },
        { merge: true }
      );

      // تحديث الحالة المحلية
      setPreview("");
      setFile(null);
      setUrl("");
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  // دالة لحذف الصورة من Firebase Storage
  const deleteOldImage = async (storagePath) => {
    if (storagePath) {
      const imageRef = ref(storage, storagePath);
      try {
        await deleteObject(imageRef);
      } catch (error) {
        console.error("Error deleting old image:", error);
      }
    }
  };

  // دالة لتحميل الصورة الجديدة وتحديث Firestore
  const handleImageUpload = async (file, storagePath, oldUrl) => {
    try {
      const fullStoragePath = `banners/${storagePath}`;
      let isUploaded = false;
      if (oldUrl) {
        // حذف الصورة القديمة
        await deleteOldImage(fullStoragePath);
      }

      // إنشاء مرجع للصورة الجديدة
      const imageRef = ref(storage, fullStoragePath);

      // رفع الصورة الجديدة
      await uploadBytes(imageRef, file);

      // الحصول على رابط الصورة الجديدة
      const imageUrl = await getDownloadURL(imageRef);

      // تحديث Firestore برابط الصورة الجديدة
      await setDoc(
        doc(db, "banners", storagePath),
        { imageUrl },
        { merge: true }
      );

      if (file && imageUrl) {
        setIsPopupVisible(true);
      }
      if (!isUploaded && file && imageUrl) {
        isUploaded = true;
        setIsPopupVisible(true);
        console.log("Navigating to dashboard...");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  // دالة لحفظ التغييرات
  const handleSave = async () => {
    try {
      if (topBanner)
        await handleImageUpload(topBanner, "topBanner", topBannerUrl);
      if (bottomBanner)
        await handleImageUpload(bottomBanner, "bottomBanner", bottomBannerUrl);
      if (logo) await handleImageUpload(logo, "logo", logoUrl);
      if (homeElements)
        await handleImageUpload(homeElements, "homeElements", homeElementsUrl);
    } catch (error) {
      console.log("Error saving, please try again.", error);
    }
  };

  return (
    <div className="flex flex-col items-center mt-32 w-full  mb-48">
      <div className="gap-5 justify-center w-full xs:w-[90%] sm:w-[70%] lg:w-full">
        <div className="flex flex-wrap justify-center gap-5 w-full">
          {/* Top Banner */}
          <Label
            htmlFor="top-banner"
            className="mb-9 relative flex h-64 w-full md:w-96 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">{t("edittheme.upload")}</span>
              </p>
              <p className="text-xs text-gray-500">
                {t("edittheme.topBanner")}
              </p>

              {topBannerPreview ? (
                <img
                  src={topBannerPreview}
                  alt="Top Banner"
                  className="mt-2 h-32 w-full object-cover"
                />
              ) : topBannerUrl ? (
                <img
                  src={topBannerUrl}
                  alt="Top Banner"
                  className="mt-2 h-32 w-full object-cover"
                />
              ) : (
                <p className="text-gray-400">No image currently</p>
              )}
            </div>

            <input
              id="top-banner"
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files[0]) {
                  setTopBanner(e.target.files[0]);
                  setTopBannerPreview(URL.createObjectURL(e.target.files[0]));
                }
              }}
            />
            <button
              onClick={() =>
                handleDeleteImage(
                  "topBanner",
                  setTopBannerPreview,
                  setTopBanner,
                  setTopBannerUrl
                )
              }
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
            >
              ❌
            </button>
          </Label>

          {/* Bottom Banner */}
          <Label
            htmlFor="bottom-banner"
            className="relative flex h-64 w-full md:w-96 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">{t("edittheme.upload")}</span>
              </p>
              <p className="text-xs text-gray-500">
                {t("edittheme.bottomBanner")}
              </p>

              {bottomBannerPreview ? (
                <img
                  src={bottomBannerPreview}
                  alt="Bottom Banner"
                  className="mt-2 h-32 w-full object-cover"
                />
              ) : bottomBannerUrl ? (
                <img
                  src={bottomBannerUrl}
                  alt="Bottom Banner"
                  className="mt-2 h-32 w-full object-cover"
                />
              ) : (
                <p className="text-gray-400">No image currently</p>
              )}
            </div>

            <input
              id="bottom-banner"
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files[0]) {
                  setBottomBanner(e.target.files[0]);
                  setBottomBannerPreview(
                    URL.createObjectURL(e.target.files[0])
                  );
                }
              }}
            />
            <button
              onClick={() =>
                handleDeleteImage(
                  "bottomBanner",
                  setBottomBannerPreview,
                  setBottomBanner,
                  setBottomBannerUrl
                )
              }
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
            >
              ❌
            </button>
          </Label>

          {/* Logo */}
          <Label
            htmlFor="logo"
            className="mb-9 relative flex h-64 w-full md:w-96 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">{t("edittheme.upload")}</span>
              </p>
              <p className="text-xs text-gray-500">{t("edittheme.logo")}</p>

              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo"
                  className="mt-2 h-32 w-full object-cover"
                />
              ) : (
                logoUrl && (
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="mt-2 h-32 w-full object-cover"
                  />
                )
              )}
            </div>

            <input
              id="logo"
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files[0]) {
                  setLogo(e.target.files[0]);
                  setLogoPreview(URL.createObjectURL(e.target.files[0]));
                }
              }}
            />
            <button
              onClick={() =>
                handleDeleteImage("logo", setLogoPreview, setLogo, setLogoUrl)
              }
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
            >
              ❌
            </button>
          </Label>

          {/* Home Elements */}
          <Label
            htmlFor="home-elements"
            className="relative flex h-64 w-full md:w-96 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">{t("edittheme.upload")}</span>
              </p>
              <p className="text-xs text-gray-500">
                {t("edittheme.homeElements")}
              </p>

              {homeElementsPreview ? (
                <img
                  src={homeElementsPreview}
                  alt="Home Elements"
                  className="mt-2 h-32 w-full object-cover"
                />
              ) : (
                homeElementsUrl && (
                  <img
                    src={homeElementsUrl}
                    alt="Home Elements"
                    className="mt-2 h-32 w-full object-cover"
                  />
                )
              )}
            </div>

            <input
              id="home-elements"
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files[0]) {
                  setHomeElements(e.target.files[0]);
                  setHomeElementsPreview(
                    URL.createObjectURL(e.target.files[0])
                  );
                }
              }}
            />
            <button
              onClick={() =>
                handleDeleteImage(
                  "homeElements",
                  setHomeElementsPreview,
                  setHomeElements,
                  setHomeElementsUrl
                )
              }
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
            >
              ❌
            </button>
          </Label>
        </div>
      </div>
      <div>
        {isPopupVisible && (
          <div style={popupStyles}>
            <div style={popupContentStyles}>
              <p>{t("legislationForm.alert")}</p>
              <button
                onClick={() => {
                  setIsPopupVisible(false);
                }}
                className="text-red-600"
              >
                {t("text.close")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Save button */}
      <div className="w-full flex justify-center mt-5">
        <button
          onClick={handleSave}
          className={`-mt-6 aux-button aux-curve aux-gold flex items-center justify-center text-lg font-bold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300 `}
        >
          <span className="flex items-center space-x-4 aux-text">
          {t("legislationForm.save")}
          </span>
        </button>
      </div>
    </div>
  );
};

export default EditTheme;
const popupContentStyles = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  textAlign: "center",
};
const popupStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
