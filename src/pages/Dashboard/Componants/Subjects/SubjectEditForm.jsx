/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Button, Label, Textarea, TextInput, Select } from "flowbite-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import db from "../../../../config/firebase";
import { useTranslation } from "react-i18next";
import save from "../../../../../src/assets/save.png";
import Bottombanner from "../../../Home/componants/banner/Bottombanner";
import Topbanner from "../../../Home/componants/banner/Topbanner";
import "../../../Home/Card.css";
import { IoArrowBack } from "react-icons/io5";
export default function SubjectEditForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const subject = location.state?.subject || {};

  const [matrix, setMatrix] = useState([]);
  const { t, i18n } = useTranslation("global");
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const [subjectData, setSubjectData] = useState({
    subjectNum: subject.subjectNum || "",
    subjectField: subject.subjectField || "",
    subjectTitle: subject.subjectTitle || "",
    subjectContent: subject.subjectContent || "",
    relatedLegislation: subject.relatedLegislation || "",
    notes: subject.notes || "",
  });

  // Handle form input change for subject data
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setSubjectData({ ...subjectData, [id]: value });
  };

  // Handle shared employee change

  // Remove shared employee

  // Save updated subject data
  const handleSave = async (docID) => {
    const subjectRef = doc(db, "subjects", subject.id);

    try {
      // Update the subject document with the new subject data
      await updateDoc(subjectRef, subjectData);

      // Show the success popup after updating the subject document
      setIsPopupVisible(true);

      // Fetch the related legislation document reference
      const matrixDocRef = doc(db, "legislations", docID);

      // Fetch the legislation document snapshot
      const matrixDocSnapshot = await getDoc(matrixDocRef);

      // Check if the legislation document exists
      if (matrixDocSnapshot.exists()) {
        const matrixData = matrixDocSnapshot.data();
        const subjectsArray = matrixData.subjects || [];

        // Find the index of the existing subject in the array
        const subjectIndex = subjectsArray.indexOf(subject.subjectTitle);

        if (subjectIndex !== -1) {
          // If the subject is found, update it with the new title
          subjectsArray[subjectIndex] = subjectData.subjectTitle;
        } else {
          // If the subject is not found, add it to the array
          subjectsArray.push(subjectData.subjectTitle);
        }

        // Update the 'subjects' array in the legislation document
        await updateDoc(matrixDocRef, {
          subjects: subjectsArray, // Replace the entire array with the updated one
        });

        // Optional: You can navigate to a different page after a successful update
        // navigate("/dashboard");
      } else {
        console.error("Related legislation document does not exist.");
      }
    } catch (error) {
      console.error("Error updating subject:", error);
    }
  };

  useEffect(() => {
    // const matrixCollectionRef = collection(db, "matrix");
    const qMatrix = query(
      collection(db, "legislations"),
      where("intro", "!=", 0)
    );
    const unsubscribeMatrix = onSnapshot(qMatrix, (snapshot) => {
      const matrixList = [];
      snapshot.forEach((doc) => matrixList.push({ id: doc.id, ...doc.data() }));
      setMatrix(matrixList);
    });

    // Fetch employee data
    // const employeesCollectionRef = collection(db, "employees");

    return () => {
      unsubscribeMatrix();
    };
  }, []);
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div>
      <Topbanner />
      <div dir={direction}>
        <button
          className="text-center fixed bg-[#CDA03D]  py-2 px-3 shadow-xl m-9 rounded-full text-white flex  text-lg font-bold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300"
          onClick={handleBack}
          dir={direction}
  
        >
          <IoArrowBack className="" /> 
        </button>
      </div>
      <div className="flex mt-[150px]" dir={direction} style={{ paddingBottom: "400px" }}>
        <div className="mx-auto p-8 w-full max-w-5xl">
          <h1
            className="text-3xl font-semibold text-white bg-[#CDA03D] p-5 rounded-t-xl"
            dir={direction}
          >
            {t("subjectEditForm.editSubject")}
          </h1>

          {/* Form Section */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
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
                  value={subjectData.subjectField}
                  onChange={handleInputChange}
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
                  value={subjectData.subjectNum}
                  onChange={handleInputChange}
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
                  value={subjectData.subjectTitle}
                  onChange={handleInputChange}
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
                  value={subjectData.subjectContent}
                  onChange={handleInputChange}
                />
              </div>

        
            </div>

            {/* Related Matrix */}
            <div className=" col-span-2 pt-8" dir={direction}>
              <Label
                htmlFor="relatedMatrix"
                value={t("subjectEditForm.relatedLegislations")}
                className="text-xl font-semibold"
              />
              <Select
                id="relatedMatrix"
                className="mt-2"
                value={subjectData.relatedLegislation.title || ""}
                onChange={(e) => {
                  const selectedMatrix = matrix.find(
                    (item) => item.title === e.target.value
                  );
                  setSubjectData({
                    ...subjectData,
                    relatedMatrix: selectedMatrix,
                  });
                }}
              >
                {matrix.map((item) => (
                  <option key={item.id} value={item.title}>
                    {item.title}
                  </option>
                ))}
              </Select>
            </div>

            {/* Notes */}
            <div className="text-right col-span-2 pt-8">
              <Label
                htmlFor="notes"
                value={t("subjectEditForm.notes")}
                className="text-xl font-semibold"
              />
              <Textarea
                id="notes"
                rows={4}
                className="mt-2"
                value={subjectData.notes}
                onChange={handleInputChange}
              />
            </div>

            {/* Save Button */}
            <div className="mt-6 flex justify-center">
              <div
                onClick={() => {
                  const legislation = matrix.find(
                    (item) =>
                      item.title === subjectData.relatedLegislation.title
                  );

                  handleSave(legislation.id);
                }}
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
                  <p>{t("legislationForm.alert")}</p>
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
