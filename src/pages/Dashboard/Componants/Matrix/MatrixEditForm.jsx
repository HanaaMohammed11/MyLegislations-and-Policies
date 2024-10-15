import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Label, TextInput, Textarea } from "flowbite-react";
import { doc, updateDoc } from "firebase/firestore";
import db from "../../../../config/firebase";
import { useTranslation } from "react-i18next";
import { IoArrowBack } from "react-icons/io5";
import Topbanner from "../../../Home/componants/banner/Topbanner";
import Bottombanner from "../../../Home/componants/banner/Bottombanner";
import "../../../Home/Card.css";

export default function MatrixEditForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const matrix = location.state?.matrix;
  const { t, i18n } = useTranslation("global");

  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [matrixData, setMatrixData] = useState({
    title: matrix.title || "",
    companyName: matrix.companyName || "",
    updateDate: matrix.updateDate || "",
    releaseDate: matrix.releaseDate || "",
    intro: matrix.intro || "",
    notes: matrix.notes || "",
    definitions: matrix.definitions || [{ term: "", interpretation: "" }],
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setMatrixData({ ...matrixData, [id]: value });
  };

  const handleDefinitionChange = (index, field, value) => {
    const updatedDefinitions = matrixData.definitions.map((def, i) =>
      i === index ? { ...def, [field]: value } : def
    );
    setMatrixData({ ...matrixData, definitions: updatedDefinitions });
  };

  const handleAddDefinition = () => {
    setMatrixData({
      ...matrixData,
      definitions: [...matrixData.definitions, { term: "", interpretation: "" }],
    });
  };

  const handleSave = async () => {
    const matrixRef = doc(db, "matrix", matrix.id);
    try {
      await updateDoc(matrixRef, matrixData);
      setIsPopupVisible(true);
    } catch (error) {
      console.error("Error updating matrix:", error);
      alert(t("matrixEditForm.errorUpdating")); // Inform the user about the error
    }
  };

  return (
    <div>
      <Topbanner />
      <div dir={direction} >
        <button
        style={{marginTop:"400px"}}
          className="text-center bg-[#CDA03D] py-2 px-9 shadow-xl m-9 rounded-full text-white flex text-lg font-bold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300"
          onClick={handleBack}
        >
          <IoArrowBack className="mt-1 mr-3" /> {t("text.back")}
        </button>
        <div className="mx-auto p-8 w-full max-w-5xl" style={{paddingBottom:"400px"}}>
          <h1 className="text-3xl font-semibold text-white bg-[#CDA03D] p-5 rounded-t-xl">
            {t("matrixEditForm.updateMatrix")}
          </h1>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries({
                companyName: t("matrixEditForm.companyName"),
                title: t("matrixEditForm.matrixName"),
                updateDate: t("matrixEditForm.updateDate"),
                releaseDate: t("matrixEditForm.releaseDate"),
              }).map(([key, label]) => (
                <div className="xs:col-span-2 md:col-span-1" key={key}>
                  <Label htmlFor={key} value={label} />
                  <TextInput
                    id={key}
                    type={key.includes("Date") ? "date" : "text"}
                    value={matrixData[key]}
                    onChange={handleInputChange}
                  />
                </div>
              ))}
              <div className="col-span-2">
                <Label htmlFor="intro" value={t("matrixEditForm.Introduction")} />
                <Textarea
                  id="intro"
                  rows={4}
                  value={matrixData.intro}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="notes" value={t("matrixEditForm.notes")} />
                <Textarea
                  id="notes"
                  rows={4}
                  value={matrixData.notes}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Definitions Section */}
            <h2 className="text-2xl font-semibold text-white bg-[#CDA03D] p-4 md:p-5 rounded-t-xl mt-6 md:mt-9">
              {t("matrixEditForm.definitions")}
            </h2>
            <div className="bg-white p-4 md:p-8 rounded-lg shadow-md">
              {matrixData.definitions.map((definition, index) => (
                <div key={index} className="grid grid-cols-1 gap-4 mb-4 w-full">
                  <div className="col-span-2 w-full">
                    <Label htmlFor={`term-${index}`} value={t("matrixEditForm.term")} />
                    <TextInput
                      id={`term-${index}`}
                      type="text"
                      value={definition.term}
                      onChange={(e) =>
                        handleDefinitionChange(index, "term", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-2 w-full">
                    <Label htmlFor={`interpretation-${index}`} value={t("matrixEditForm.interpretation")} />
                    <Textarea
                      id={`interpretation-${index}`}
                      rows={4}
                      value={definition.interpretation}
                      onChange={(e) =>
                        handleDefinitionChange(index, "interpretation", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
              <div className="mt-4 text-right">
                <Button onClick={handleAddDefinition} className="bg-gray-700">
                  {t("matrixEditForm.addNewDef")}
                </Button>
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <div onClick={handleSave}            className={`aux-button aux-curve aux-gold flex items-center justify-center text-lg font-bold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300 `}
              >
              <span className="aux-text"> {t("matrixEditForm.save")}</span> 
              </div>
            </div>
            {isPopupVisible && (
              <div style={popupStyles}>
                <div style={popupContentStyles}>
                  <p>{t("matrixForm.alert")}</p>
                  <button
                    onClick={() => {
                      setIsPopupVisible(false);
                      navigate(-1);
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
      </div>
      <Bottombanner />
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
