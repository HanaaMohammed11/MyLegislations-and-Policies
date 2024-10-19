import { useEffect, useState } from "react";
import Bottombanner from "../../Home/componants/banner/Bottombanner";
import Topbanner from "../../Home/componants/banner/Topbanner";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SubTable from "./SubCard"
import { doc, getDoc } from "firebase/firestore";
import db from "../../../config/firebase";

export default function SubjectsLists() {
  const { t, i18n } = useTranslation("global");
  const location = useLocation();
  const { filteredMatrices } = location.state || [];
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [accountType, setAccountType] = useState("");
  const [tempSearchQuery, setTempSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState(""); 
  useEffect(() => {
    const storedAccountType = localStorage.getItem("accountType"); 
    if (storedAccountType) {
      setAccountType(storedAccountType);
    }
  }, []);
  const handleSearch = () => {
    if (tempSearchQuery === "") {
      setSearchTerm("");
    } else {
      setSearchTerm(tempSearchQuery);
    }
  };

  const clearSearch = () => {
    setTempSearchQuery("");
    setSearchTerm("");
    setSearchType("");
  };

  return (
    <div
      className="flex flex-col"
      style={{ paddingTop: "270px", paddingBottom: "44px" }}
    >
      <div className="relative flex justify-center items-center text-center">
        <Topbanner />
      </div>

      <div className="search flex justify-center mt-9">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="mr-2 rounded-md p-2"
        >
          <option value="" disabled>{t("search.subsearch")}</option>
          <option value="subjectTitle">{t("search.subjectTitle")}</option>
          <option value="subjectNum">{t("search.subjectNum")}</option>
          <option value="subjectContent">{t("search.subjectContent")}</option>
        </select>

        {/* حقل الإدخال للبحث */}
        <input
          type="text"
          placeholder={t("articels.searchPlaceholder")}
          className="xs:w-72 sm:w-96 rounded-full"
          dir={direction}
          value={tempSearchQuery}
          onChange={(e) => setTempSearchQuery(e.target.value)}
        />
        
        <button
          onClick={handleSearch}
          className="ml-2 px-4 py-2 rounded-full bg-[#CDA03D] text-white"
        >
          {t("matrix.searchButton")}
        </button>
        <button
          onClick={clearSearch}
          className="ml-2 px-4 py-2 rounded-full bg-[#CDA03D] text-white"
        >
          {t("matrix.clearFilters")}
        </button>
      </div>

      {accountType === "user" && searchTerm && (
  <div className="flex-grow">
    <SubTable searchTerm={searchTerm} searchType={searchType} />
  </div>
)}

{accountType === "admin" && (
  <div className="flex-grow mb-36">
    <SubTable searchTerm={searchTerm} searchType={searchType} />
  </div>
)}


      <div className="mt-auto">
        <Bottombanner />
      </div>
    </div>
  );
}
