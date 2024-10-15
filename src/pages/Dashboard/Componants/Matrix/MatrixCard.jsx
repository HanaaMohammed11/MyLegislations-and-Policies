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

export default function MatrixCard({ searchQuery }) {
  const [matrix, setMatrix] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation("global");
  const [isPopupVisible, setIsPopupVisible] = useState(false);

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

  return (
    <div className={`mx-4  mt-32 mb-9 w-full ${direction} `}>
      {loading ? (
        <div className="flex justify-center items-center mt-44">
          <Loader />
        </div>
      ) : filteredMatrix.length > 0 ? (
        <div
          className={`overflow-x-auto overflow-y-auto mx-4 md:mx-14 shadow-2xl mb-9 mt-3 ${direction} }`}
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
              {filteredMatrix.map((card, index) => (
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
                        onClick={() => show(card)}
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
        </div>
      ) : (
        <div className="text-center">{t("matrixCardDashboard.noMatrix")}</div>
      )}
    </div>
  );
}
