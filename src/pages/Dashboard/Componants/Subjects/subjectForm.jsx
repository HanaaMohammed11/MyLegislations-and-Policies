/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Button, Label, Textarea, TextInput, Select } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import db from "../../../../config/firebase";
import "../../../Home/Card.css";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useTranslation } from "react-i18next";
import save from "../../../../../src/assets/save.png";
export default function SubjectForm({ onClose }) {
  const navigate = useNavigate();
  const [subjectNum, setSubjectNum] = useState("");
  const [subjectField, setSubjectField] = useState("");
  const [subjectTitle, setSubjectTitle] = useState("");
  const [subjectContent, setSubjectContent] = useState("");
  const [relatedLegislation, setRelatedLegislation] = useState({});
  const [notes, setNotes] = useState("");
  const [legislation, setLegislation] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const [negotiationLimit, setNegotiationLimit] = useState("");
  const { t, i18n } = useTranslation("global");

  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const handleSave = async () => {
    const data = {
      subjectNum,
      subjectField,
      subjectTitle,
      subjectContent,
      relatedLegislation,
      notes,
    };

    try {
      const subjectRef = await addDoc(collection(db, "subjects"), data);
      setIsPopupVisible(true);
      onClose();
      const matrixDocRef = doc(db, "legislations", relatedLegislation.id);

      const matrixDocSnapshot = await getDoc(matrixDocRef);
      if (matrixDocSnapshot.exists()) {
        await updateDoc(matrixDocRef, {
          subjects: arrayUnion(data.subjectTitle),
        });

        // navigate("/dashboard");
      } else {
        alert("The specified matrix does not exist.");
      }
    } catch (error) {
      console.error("Error adding or updating document: ", error);
    }
  };

  useEffect(() => {
    // const usersCollectionRef = collection(db, "matrix");
    const qMatrix = query(
      collection(db, "legislations"),
      where("intro", "!=", 0)
    );
    const unsubscribe = onSnapshot(qMatrix, (snapshot) => {
      const Matrixs = [];
      snapshot.forEach((doc) => {
        Matrixs.push({ id: doc.id, ...doc.data() });
      });
      setLegislation(Matrixs);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log("Updated relatedMatrix:", relatedLegislation);
  }, [relatedLegislation]);

  return (
    <div className="flex lg:w-[900px] md:w-[500px]  lg:mt-10 md:mt-10 mt-44 sm:mt-44   mb-16">
      <div className="mx-auto xs:py-8 xs:px-0 sm:p-8 w-full max-w-5xl">
        <h1
          dir={direction}
          className=" text-3xl font-semibold text-white bg-[#CDA03D] p-5 rounded-t-xl"
        >
          {t("subjectEditForm.addSubject")}
        </h1>

        {/* Form Section */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div
            className=" grid grid-cols-1 md:grid-cols-2 gap-6"
            dir={direction}
          >
            {/* Subject Field */}
            <div className="xs:col-span-2 md:col-span-1">
              <Label
                htmlFor="subjectField"
                value={t("subjectEditForm.field")}
                className="text-xl font-semibold"
              />
              <TextInput
                id="subjectField"
                type="text"
                sizing="sm"
                className="mt-2"
                value={subjectField}
                onChange={(e) => setSubjectField(e.target.value)}
              />
            </div>

            {/* Subject Number */}
            <div className="xs:col-span-2 md:col-span-1">
              <Label
                htmlFor="subjectNum"
                value={t("subjectEditForm.subjectNum")}
                className="text-xl font-semibold"
              />
              <TextInput
                id="subjectNum"
                type="text"
                sizing="sm"
                className="mt-2"
                value={subjectNum}
                onChange={(e) => setSubjectNum(e.target.value)}
              />
            </div>

            {/* Subject Title */}
            <div className="col-span-2">
              <Label
                htmlFor="subjectTitle"
                value={t("subjectEditForm.subjectTitle")}
                className="text-xl font-semibold"
              />
              <TextInput
                id="subjectTitle"
                type="text"
                sizing="lg"
                className="mt-2"
                value={subjectTitle}
                onChange={(e) => setSubjectTitle(e.target.value)}
              />
            </div>

            {/* Subject Content */}
            <div className="col-span-2">
              <Label
                htmlFor="subjectContent"
                value={t("subjectEditForm.subjectContent")}
                className="text-xl font-semibold"
              />
              <Textarea
                id="subjectContent"
                required
                rows={4}
                className="mt-2"
                value={subjectContent}
                onChange={(e) => setSubjectContent(e.target.value)}
              />
            </div>

     
          </div>

          <div className="grid grid-cols-1 gap-6" dir={direction}>
            {/* Related Matrix */}
            <div className="col-span-2 pt-8">
              <Label
                htmlFor="relatedMatrix"
                value={t("subjectEditForm.relatedLegislations")}
                className="text-xl font-semibold"
              />
              <Select
                id="relatedMatrix"
                className="mt-2"
                value={relatedLegislation?.title || ""} // Safely handle undefined relatedMatrix
                onChange={(e) => {
                  const selectedLegislation = legislation.find(
                    (item) => item.title === e.target.value
                  );

                  if (selectedLegislation) {
                    setRelatedLegislation({
                      ...selectedLegislation,
                    });
                  }
                }}
              >
                <option value="" disabled>
      {t("legislationForm.choose")}
                </option>
                {legislation?.length > 0 &&
                  legislation.map((item) => (
                    <option key={item.id} value={item.title}>
                      {item.title}
                    </option>
                  ))}
              </Select>

              {/* Use useEffect to log the updated relatedMatrix */}
            </div>

            {/* Notes */}
            <div className="col-span-2 pt-8">
              <Label
                htmlFor="notes"
                value={t("subjectEditForm.notes")}
                className="text-xl font-semibold"
              />
              <Textarea
                id="notes"
                rows={4}
                className="mt-2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Save Button */}
            <div className="mt-6 flex justify-center">
              <div
                onClick={handleSave}
                className={`aux-button aux-curve aux-gold flex items-center justify-center text-lg font-bold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300 `}
              >
                <span className="flex items-center space-x-4 aux-text">
                  {t("subjectEditForm.save")}
                </span>
              </div>{" "}
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
