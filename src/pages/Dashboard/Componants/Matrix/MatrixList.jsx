/* eslint-disable no-unused-vars */
import { IoMdAdd } from "react-icons/io";
import MatrixForm from "./MatrixForm";
import MatrixCard from "./MatrixCard";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import "./././../../SideBar.css";
import MatrixInfo from "../../../Users/Matrixs/MatrixInfo";
import SubjectInfo from "../../../Users/Subjects/SubjectInfo";

export default function MatrixList() {
  const [showMatrixForm, setShowMatrixForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { t, i18n } = useTranslation("global");
  const isRtl = i18n.language === "ar";
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [selectedMatrix, setselectedMatrix] = useState(null);
  const [selectedSubject, setselectedSubject] = useState(null);
  const handleMatrixctClick = (Matrix) => {
    setselectedSubject(null);
    setselectedMatrix(Matrix);
  };
  const handleSubjectClick = (subject) => {
    setselectedMatrix(null);
    setselectedSubject(subject);
  };
  const handleClick = () => {
    setShowMatrixForm(!showMatrixForm);
  };
  const handleFormClose = () => {
    setShowMatrixForm(false);
  };
  return (
    <>
      <div className="flex flex-col  ">
        <div
          className={`flex flex-col justify-center  w-full  items-center gap-4 md:gap-9 z-10 sticky lg:fixed md:fixed sm:sticky xs:sticky `}
          >
          <div
            className="btn-button  w-64 text-center btn-curve btn-gold flex items-center text-lg font-bold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300"
            onClick={handleClick}
          >
            <span className="whitespace-nowrap flex items-center space-x-2 btn-text">
              {t("legislationForm.addNewLegislations")}
            </span>
          </div>

          {/* Search Input */}
          <div className="search flex  w-full  items-center z-10 sticky lg:fixed md:fixed sm:sticky xs:sticky mt-28">
          <input
              type="text"
              className="rounded-full text-right h-9 px-4"
              placeholder={t("legislationForm.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center mb-[30%]">
      {showMatrixForm ? (
    <MatrixForm onClose={handleFormClose} />
  ) : !selectedMatrix && !selectedSubject ? (
    <MatrixCard
      onMatrixClick={handleMatrixctClick}
      searchQuery={searchQuery}
    />
  ) : !selectedMatrix && selectedSubject ? (
    <div className="mt-32 flex justify-center items-center w-full"> 

    <SubjectInfo
      subject={selectedSubject}
      onMatrixClick={handleMatrixctClick}
      onBack={() => setselectedSubject(null)}
    />
    </div>
  ) : (
    <div className="mt-32 flex justify-center items-center w-full"> 
      <MatrixInfo
        matrix={selectedMatrix}
        onSubjectClick={handleSubjectClick}
        onBack={() => setselectedMatrix(null)}
      />
    </div>
  )}
      </div>
    </>
  );
}
