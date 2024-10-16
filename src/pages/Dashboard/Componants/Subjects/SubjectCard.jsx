/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button } from "flowbite-react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import db from "../../../../config/firebase";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Loader from "../../../Login/loader";
import { AiOutlineEdit, AiOutlineDelete, AiFillEye } from "react-icons/ai";

export default function SubjctCard({ searchTerm }) {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation("global");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const deleteSubject = async (subjectId) => {
    const subjectRef = doc(db, "subjects", subjectId);
    try {
      await deleteDoc(subjectRef);
    } catch (error) {
      console.error("Error deleting subject: ", error);
    }
  };

  const handleEdit = (subjectItem) => {
    navigate("/editsubject", { state: { subject: subjectItem } });
  };

  const handleShowInfo = (subjectItem) => {
    navigate("/AdminSubjectInfo", { state: { subject: subjectItem } });
  };

  useEffect(() => {
    const q = query(collection(db, "subjects"), where("subjectTitle", "!=", 0));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subjectsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubjects(subjectsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredSubjects = subjects.filter((subject) => {
    const searchText = searchTerm.toLowerCase().replace(/\s+/g, "");
    return (
      (subject.subjectTitle?.toLowerCase().replace(/\s+/g, "").includes(searchText)) || 
      (subject.subjectNum?.toString().toLowerCase().replace(/\s+/g, "").includes(searchText)) ||
      (subject.subjectContent?.toString().toLowerCase().replace(/\s+/g, "").includes(searchText)) ||
      (subject.subjectField?.toString().toLowerCase().replace(/\s+/g, "").includes(searchText)) ||
      (subject.ownerAdmin?.toLowerCase().replace(/\s+/g, "").includes(searchText))
    );
  });

  return (
    <div className={`mx-4  mt-32 mb-9 w-full ${direction} `}>
      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <Loader />
        </div>
      ) : filteredSubjects.length > 0 ? (
        <div className="overflow-x-auto flex justify-center items-center">
          <table className="min-w-full border-collapse" dir={direction}>
            <thead className=" uppercase bg-gray-50" dir={direction}>
              <tr>
            
                <th className="px-4 py-2  text-xl font-semibold r">
                  {t("subjectCardDashboard.subjectNum")}
                </th>
                <th className="px-4 py-2 text-xl font-semibold ">
                  {t("subjectInfo.subjectTitle")}
                </th>
                <th className="px-4 py-2  text-xl font-semibold texnter">
                  {t("subjectInfo.action")}
                </th>
              </tr>
            </thead>
            <tbody className="">
              {filteredSubjects.map((subjectItem, index) => (
                <tr
                  key={subjectItem.id}
                  className={`border-b twxt-xl  ${
                    index % 2 === 0 ? "bg-[#DEBA9A]" : "bg-white"
                  }`}
                >
            
                  <td className="px-4 py-2 font-semibold text-center text-xl">
                    {subjectItem.subjectNum}
                  </td>
                  <td className="px-4 py-2 font-semibold text-center text-xl">
                    {subjectItem.subjectTitle}
                  </td>
                  <td className="px-4 py-2 font-semibold text-center flex justify-center space-x-3">
                    <button
                      onClick={() => handleShowInfo(subjectItem)}
                      className="text-blue-500 ml-3"
                    >
                      <AiFillEye size={20} />
                    </button>
                    <button
                      onClick={() => handleEdit(subjectItem)}
                      className="bg-transparent border-0"
                    >
                      <AiOutlineEdit
                        size={20}
                        className="text-yellow-500 hover:text-blue-700"
                        title="Edit"
                      />
                    </button>
                    <button
                      onClick={() => deleteSubject(subjectItem.id)}
                      className="bg-transparent border-0"
                    >
                      <AiOutlineDelete
                        size={20}
                        className="text-red-700 hover:text-red-900"
                        title="Delete"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-4 text-center text-neutral-600">
          {t("subjectInfo.noRelatedSubjects")}
        </div>
      )}

      {/* Popup for deletion confirmation */}
      {isPopupVisible && (
        <div style={popupStyles}>
          <div style={popupContentStyles}>
            <h3 className="font-semibold">
              {t("matrixEditForm.savedSuccessfully")}
            </h3>
            <div className="mt-4">
              <Button onClick={() => setIsPopupVisible(false)}>
                {t("text.ok")}
              </Button>
            </div>
          </div>
        </div>
      )}
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
