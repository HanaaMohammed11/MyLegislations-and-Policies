/* eslint-disable no-unused-vars */
import { IoMdAdd } from "react-icons/io";
import MatrixForm from "./MatrixForm";
import MatrixCard from "./MatrixCard";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import "./././../../SideBar.css";

export default function MatrixList() {
  const [showMatrixForm, setShowMatrixForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { t, i18n } = useTranslation("global");
  const isRtl = i18n.language === "ar";
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

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
          className={`flex flex-col md:flex-row w-full justify-end items-center gap-4 md:gap-9 z-10 sticky lg:fixed md:fixed sm:sticky xs:sticky `}
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
          <div className="search flex justify-center items-center">
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
        ) : (
          <MatrixCard searchQuery={searchQuery} />
        )}
      </div>
    </>
  );
}
