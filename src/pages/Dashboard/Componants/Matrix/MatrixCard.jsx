/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import db from "../../../../config/firebase";
import { useTranslation } from "react-i18next";
import Loader from "../../../Login/loader";
import { AiFillEye, AiFillEdit, AiFillDelete } from "react-icons/ai";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";

export default function MatrixCard({ searchQuery, onMatrixClick }) {
  const [matrix, setMatrix] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation("global");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const id = useId();
  const navigate = useNavigate();

  const deleteMatrix = async (legislationsId) => {
    const matrixRef = doc(db, "legislations", legislationsId);
    try {
      await deleteDoc(matrixRef);
      console.log("تم حذف المستند بنجاح!");
      setIsPopupVisible(true);
    } catch (error) {
      console.error("خطأ في حذف المستند: ", error);
    }
  };

  const show = (legislationItem) => {
    console.log("Showing info for:", legislationItem);
    navigate("/AdminMtrixInfo", { state: { Legislation: legislationItem } });
  };

  const edit = (legislationItem) => {
    navigate("/MatrixEditForm", { state: { Legislation: legislationItem } });
  };

  useEffect(() => {
    const q = query(collection(db, "legislations"), where("intro", "!=", 0));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const matrixData = [];
      snapshot.forEach((doc) => {
        matrixData.push({ id: doc.id, ...doc.data() });
      });
      setMatrix(matrixData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredMatrix = matrix.filter((card) =>
    card.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

    // Total pages based on filtered subjects
    const totalPages = Math.ceil(filteredMatrix.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentMatrices = filteredMatrix.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className={`mx-4  mt-32 mb-9 w-full ${direction} `}>
      {loading ? (
        <div className="flex justify-center items-center mt-44">
          <Loader />
        </div>
      ) : filteredMatrix.length > 0 ? (
        <div
          className={`overflow-x-auto overflow-y-auto mx-4 md:mx-14 mb-9 mt-3 ${direction} }`}
        >
          <table
            className="min-w-full text-center text-xl font-semibold  shadow-lg "
            dir={direction}
          >
            <thead className=" uppercase bg-gray-50 text-xl font-semibold ">
              <tr>
                <th scope="col" className="px-4 py-2 md:px-6 md:py-3">
                  {t("legislationsinfo.name")}
                </th>
                <th scope="col" className="px-4 py-2 md:px-6 md:py-3">
                  {t("legislationsinfo.publisher")}
                </th>
                <th scope="col" className="px-4 py-2 md:px-6 md:py-3">
                  {t("subjectInfo.action")}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentMatrices.map((card, index) => (
                <tr
                  key={card.id}
                  className={`${
                    index % 2 === 0 ? "bg-[#DEBA9A]" : "bg-white"
                  } border-b text-xl transition-all`}
                >
                  {/* العنوان */}
                  <td className="px-4 py-2 md:px-6 md:py-4 font-semibold  dark:text-white whitespace-nowrap ">
                    {card.title}
                  </td>
                  <td className="px-4 py-2 md:px-6 md:py-4  ">
                    {card.companyName}
                  </td>
                  <td className="py-2 px-4 text-center">
                    <div className="flex justify-center space-x-2 md:space-x-4">
                      {/* أيقونة العرض */}
                      <button
                        onClick={() =>     onMatrixClick(card)}
                        className="text-blue-500 ml-4"
                      >
                        <AiFillEye size={20} />
                      </button>

                      {/* أيقونة التعديل */}
                      <button
                        onClick={() => edit(card)}
                        className="text-yellow-500"
                      >
                        <AiFillEdit size={20} />
                      </button>

                      {/* أيقونة الحذف */}
                      <button
                        onClick={() => deleteMatrix(card.id)}
                        className="text-red-500"
                      >
                        <AiFillDelete size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
              {/* Pagination Controls */}
        <div className="flex justify-center mt-9">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`flex items-center `}
        >
          {i18n.language === 'ar' ? (
            <MdKeyboardDoubleArrowRight className="ml-2" color="black" size={25} />
          ) : (
            <MdKeyboardDoubleArrowLeft className="mr-2" color="black" size={25} />
          )}
        </button>

        <span className="mx-2">
          {t("pagination.page")} {currentPage} {t("pagination.of")} {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`flex items-center }`}
        >
          {i18n.language === 'ar' ? (
            <MdKeyboardDoubleArrowLeft className="ml-2" color="black" size={25} />
          ) : (
            <MdKeyboardDoubleArrowRight className="mr-2" color="black" size={25} />
          )}
        </button>
      </div>
        </div>
      ) : (
        <div className="text-center">{t("matrixCardDashboard.noMatrix")}</div>
      )}
    </div>
  );
}
