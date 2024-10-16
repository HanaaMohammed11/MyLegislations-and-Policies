import React, { useState } from "react";
import SubjectForm from "./subjectForm";
import SubjctCard from "./SubjectCard";
import { useTranslation } from "react-i18next";
import "../../../Dashboard/btns.css";

export default function SubjectList() {
  const [showSubForm, setShowSubForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { t, i18n } = useTranslation("global");

  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const handleClick = () => {
    setShowSubForm(!showSubForm);
  };
  const handleFormClose = () => {
    setShowSubForm(false);
  };
  return (
    <div className="">
      <div className="">
        {/* Header Section */}

        <div
          className={`flex flex-col md:flex-row w-full justify-end items-center gap-4 md:gap-9  sticky lg:fixed md:fixed sm:sticky xs:sticky`}
        >
          <div
            className="btn-button text-center btn-curve btn-gold flex items-center text-lg font-bold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300"
            onClick={handleClick}
          >
            <span className="whitespace-nowrap flex items-center space-x-2 btn-text">
              <span className="whitespace-nowrap flex items-center space-x-2 btn-text">
                {t("subjectEditForm.addSubject")}
              </span>
            </span>
          </div>

          {/* Search Input */}
          <div className="search flex justify-center items-center">
            <input
              type="text"
              className="rounded-full text-right h-9 px-4"
              placeholder={t("legislationForm.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-wrap justify-center mb-96">
          {showSubForm ? (
            <SubjectForm onClose={handleFormClose} />
          ) : (
            <SubjctCard searchTerm={searchTerm} />
          )}
        </div>
      </div>
    </div>
  );
}
