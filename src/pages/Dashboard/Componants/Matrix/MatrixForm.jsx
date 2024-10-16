/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Button, Label, Select, Textarea, TextInput } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import db from "../../../../config/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import save from "../../../../../src/assets/save.png";
import "../../../Home/Card.css";
export default function MatrixForm({ onClose }) {
  const [definitions, setDefinitions] = useState([
    { term: "", interpretation: "" },
  ]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [title, setTitle] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [updateDate, setUpdateDate] = useState("");
  const [category, setCategory] = useState("");
  const [intro, setIntro] = useState("");
  const [notes, setNotes] = useState("");
  const { t, i18n } = useTranslation("global");

  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const navigation = useNavigate();

  const handleSave = async () => {
    const data = {
      // ownerAdmin: localStorage.getItem("id"),
      title: title,
      companyName: companyName,
      releaseDate: releaseDate,
      updateDate: updateDate,
      category: category,
      intro: intro,
      notes: notes,
      definitions: definitions.map((def) => ({
        term: def.term,
        interpretation: def.interpretation,
      })),
    };

    try {
      await addDoc(collection(db, "legislations"), data);
      setIsPopupVisible(true);
      onClose();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleAddDefinition = () => {
    setDefinitions([...definitions, { term: "", interpretation: "" }]);
  };

  const handleDefinitionChange = (index, field, value) => {
    const newDefinitions = [...definitions];
    newDefinitions[index][field] = value;
    setDefinitions(newDefinitions);
  };

  return (
    <div className="flex flex-col items-center \ p-4  lg:mt-10 md:mt-10 mt-44 sm:mt-44  mb-44">
      <div className="w-full max-w-5xl p-4 md:p-8">
        <h1
          dir={direction}
          className=" text-2xl md:text-3xl font-semibold text-white bg-[#CDA03D] p-4 md:p-5 rounded-t-xl"
        >
          {t("legislationForm.addNewLegislations")}
        </h1>

        {/* قسم تفاصيل المصفوفة */}
        <div className="bg-white p-4 md:p-8 rounded-lg shadow-md lg:w-[900px] md:w-[500px]">
          <div
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
            dir={direction}
          >
            {/* الجهة المنشئة */}
            <div className="xs:col-span-2 md:col-span-1 w-full">
              <Label
                htmlFor="issuer"
                value={t("legislationForm.companyName")}
                className="text-lg md:text-xl font-semibold"
              />
              <TextInput
                id="issuer"
                type="text"
                sizing="sm"
                className="mt-2 w-full"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            {/*اسم التشريع*/}
            <div className="xs:col-span-2 md:col-span-1 w-full">
              <Label
                htmlFor="matrix-name"
                value={t("legislationForm.legislationsName")}
                className="text-lg md:text-xl font-semibold"
              />
              <TextInput
                id="matrix-name"
                type="text"
                sizing="sm"
                className="mt-2 w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* تاريخ التعديل */}
            <div className="xs:col-span-2 md:col-span-1 w-full">
              <Label
                htmlFor="modification-date"
                value={t("legislationForm.updateDate")}
                className="text-lg md:text-xl font-semibold"
              />
              <TextInput
                id="modification-date"
                type="date"
                className="mt-2 w-full"
                value={updateDate}
                onChange={(e) => setUpdateDate(e.target.value)}
              />
            </div>

            {/* تاريخ الإصدار */}
            <div className="xs:col-span-2 md:col-span-1 w-full">
              <Label
                htmlFor="release-date"
                value={t("legislationForm.releaseDate")}
                className="text-lg md:text-xl font-semibold"
              />
              <TextInput
                id="release-date"
                type="date"
                className="mt-2 w-full"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
              />
            </div>

            {/* تنصيف التشريع */}
            <div className="col-span-2 w-full">
              <Label
                htmlFor="category"
                value={t("legislationForm.category")}
                className="text-lg md:text-xl font-semibold"
              />
              <Select
                id="category"
                className="mt-2 w-full"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option disabled value="">
        {t("legislationForm.choose")}
                </option>
                <option value="قانون">{t("select.law")}</option>
                <option value="النظام">{t("select.system")}</option>
                <option value="اللائحة التنفيذية">{t("select.executiveRegulations")}</option>
           
                <option value="قرارات ">{t("select.decisions")}</option>
                <option value="تعليمات">{t("select.instructions")}</option>
              </Select>
            </div>
            {/* المقدمة */}
            <div className="col-span-2 w-full">
              <Label
                htmlFor="introduction"
                value={t("legislationForm.Introduction")}
                className="text-lg md:text-xl font-semibold"
              />
              <Textarea
                rows={4}
                id="introduction"
                type="text"
                sizing="lg"
                className="mt-2 w-full"
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
              />
            </div>

            {/* الملاحظات */}
            <div className="col-span-2 w-full">
              <Label
                htmlFor="notes"
                value={t("legislationForm.notes")}
                className="text-lg md:text-xl font-semibold"
              />
              <Textarea
                id="notes"
                rows={4}
                type="text"
                sizing="lg"
                className="mt-2 w-full"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* قسم التعريفات */}
        <h2
          dir={direction}
          className=" text-2xl md:text-2xl font-semibold text-white bg-[#CDA03D] p-4 md:p-5 rounded-t-xl mt-6 md:mt-9"
        >
          {t("legislationForm.definitions")}
        </h2>

        <div className="bg-white p-4 md:p-8 rounded-lg shadow-md">
          {definitions.map((definition, index) => (
            <div
              key={index}
              className=" grid grid-cols-1 gap-4 mb-4 w-full"
              dir={direction}
            >
              {/* المصطلح */}
              <div className="col-span-2 w-full">
                <Label
                  htmlFor={`term-${index}`}
                  value={t("legislationForm.term")}
                  className="text-lg md:text-xl font-semibold"
                />
                <TextInput
                  id={`term-${index}`}
                  type="text"
                  sizing="sm"
                  className="mt-2 w-full"
                  value={definition.term}
                  onChange={(e) =>
                    handleDefinitionChange(index, "term", e.target.value)
                  }
                />
              </div>

              {/* التفسير */}
              <div className="col-span-2 w-full">
                <Label
                  htmlFor={`interpretation-${index}`}
                  value={t("legislationForm.interpretation")}
                  className="text-lg md:text-xl font-semibold"
                />
                <Textarea
                  id={`interpretation-${index}`}
                  required
                  rows={4}
                  className="mt-2 w-full"
                  value={definition.interpretation}
                  onChange={(e) =>
                    handleDefinitionChange(
                      index,
                      "interpretation",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          ))}

          {/* زر لإضافة تعريف جديد */}
          <div className="mt-4 " dir={direction}>
            <Button onClick={handleAddDefinition} className="bg-gray-700">
              {t("legislationForm.addNewDef")}
            </Button>
          </div>
        </div>

        {/* زر حفظ */}
        <div className="mt-8 justify-center flex" dir={direction}>
          <div
            onClick={handleSave}
            className={`aux-button aux-curve aux-gold flex items-center justify-center text-lg font-bold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300 `}
          >
            <span className="flex items-center space-x-4 aux-text">
              {t("legislationForm.save")}
            </span>
          </div>
        </div>
        {isPopupVisible && (
          <div style={popupStyles}>
            <div style={popupContentStyles}>
              <p>{t("legislationForm.alert")}</p>
              <button
                onClick={() => {
                  setIsPopupVisible(false);
                  navigation(-1);
                }}
                className="text-red-600"
              >
                {t("text.close")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
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
