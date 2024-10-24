import { useEffect, useState } from "react";
import Bottombanner from "../../Home/componants/banner/Bottombanner";
import Topbanner from "../../Home/componants/banner/Topbanner";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SubTable from "./SubCard"
import { doc, getDoc } from "firebase/firestore";
import db from "../../../config/firebase";
import MatrixInfo from "../Matrixs/MatrixInfo";
import SubjectInfo from "./SubjectInfo";

export default function SubjectsLists() {
  const { t, i18n } = useTranslation("global");
  const location = useLocation();
  const { filteredMatrices } = location.state || [];
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [accountType, setAccountType] = useState("");
  const [tempSearchQuery, setTempSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState(""); 
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedMatrix, setSelectedMatrix] = useState(null);  const handleSubjectClick = (subject) => {
    setSelectedMatrix(null);

    setSelectedSubject(subject);
  };
  const handleMatrixClick = (matrix) => {

    setSelectedSubject(null);
    setSelectedMatrix(matrix);
  };
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
      style={{ paddingTop: "120px", paddingBottom: "44px" }}
    >
  

  <div className="search flex-col flex xs:flex-col md:flex-row xs:items-center xs:gap-y-4 md:gap-y-0 justify-center mt-9">
  <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        className=" rounded-md  ml-2 mr-2  p-2"
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
          className="  ml-2 mr-2  px-4 py-2 rounded-full bg-[#CDA03D] text-white"
        >
          {t("matrix.searchButton")}
        </button>
        <button
          onClick={clearSearch}
          className="  ml-2 mr-2  px-4 py-2 rounded-full bg-[#CDA03D] text-white"
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
    <div className="flex-grow">
    {!selectedSubject && !selectedMatrix  ? (
      <SubTable
        searchTerm={searchTerm}
        searchType={searchType}
        onSubjectClick={handleSubjectClick}
      />
    ) : !selectedSubject &&  selectedMatrix ? (
      <MatrixInfo
        matrix={selectedMatrix}
        onSubjectClick={handleSubjectClick}
        onBack={() => setSelectedMatrix(null)}
      />
    ) : (
      <SubjectInfo
        subject={selectedSubject}
        onMatrixClick={handleMatrixClick}
        onBack={() => setSelectedSubject(null)}
      />
    )}
  </div>
)}


    
    </div>
  );
}
