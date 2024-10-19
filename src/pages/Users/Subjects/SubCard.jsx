import React, { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot } from "firebase/firestore"; // إزالة 'where'
import db from "../../../config/firebase";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Loader from "../../Login/loader";

export default function SubTable({ searchTerm, searchType }) {
  const { t, i18n } = useTranslation("global");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [matrixItems, setMatrixItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const getSubjects = async () => {
      const querySnapshot = await getDocs(collection(db, "subjects"));
      const subjectsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMatrixItems(subjectsList);
      setLoading(false);
    };
    getSubjects();
  }, []);

  const handleButtonClick = (subject) => {
    navigate("/subjectInfo", { state: { subject } });
  };

  const filteredSubjects = matrixItems.filter((subject) => {
    if (!searchType) return true; // عرض جميع النتائج إذا لم يكن هناك نوع بحث محدد
    const searchText = searchTerm.toLowerCase().trim();
    return subject[searchType]?.toLowerCase().trim().includes(searchText);
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center m-44">
        <Loader />
      </div>
    );
  }

  if (filteredSubjects.length === 0) {
    return (
      <div className={`flex justify-center mt-44 items-center h-full ${direction}`}>
        <p className=" text-gray-600 ">{t("articels.noResults")}</p>
      </div>
    );
  }

  return (
    <div className={`p-4 mb-36 overflow-x-auto mx-14 mt-9 ${direction}`}>
      <table className="table-auto w-full text-sm text-center dark:text-gray-400 shadow-lg rounded-xl mb-44" dir={direction}>
        <thead className="text-center text-xl font-semibold uppercase bg-gray-50">
          <tr className="text-center ml-9">
            <th className="px-4 py-2  text-center">
              {t("subjectCardDashboard.subjectNum")}
            </th>
            <th scope="col" className="px-4 py-2 text-lg">
              {t("subjectInfo.subjectTitle")}
            </th>
            <th scope="col" className="px-4 py-2 text-lg">
              {t("subjectInfo.action")}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredSubjects.map((item, index) => (
            <tr key={item.id} className={`${index % 2 === 0 ? "bg-[#DEBA9A]" : "bg-white"} border-b text-xl font-semibold`}>
              <td className="px-4 py-2 text-center font-semibold">
              {item.subjectNum}
              </td>
              <td className="px-4 py-3 font-semibold dark:text-white whitespace-nowrap">
                {item.subjectTitle}
              </td>
              <td className="px-4 py-3">
                <button className={`hover:underline font-semibold`} onClick={() => handleButtonClick(item)}>
                  {t("articels.details")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
