/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import db from "../../../config/firebase";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Loader from "../../Login/loader";

export default function SubTable({ searchTerm }) {
  const { t, i18n } = useTranslation("global");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [matrixItems, setMatrixItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getSubjects = async () => {
      const querySnapshot = await getDocs(
        query(collection(db, "subjects"), where("subjectTitle", "!=", 0))
      );

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
    const searchText = searchTerm.toLowerCase().replace(/\s+/g, "");
    return (
      subject.subjectTitle
        .toLowerCase()
        .replace(/\s+/g, "")
        .includes(searchText) ||
      subject.subjectNum
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "")
        .includes(searchText) ||
      subject.subjectContent
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "")
        .includes(searchText) ||
      subject.subjectField
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "")
        .includes(searchText) ||
      subject.ownerAdmin.toLowerCase().replace(/\s+/g, "").includes(searchText)
    );
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
      <div
        className={`flex justify-center mt-44 items-center h-full ${direction}`}
      >
        <p className="text-xl  font-semibold">{t("articels.noResults")}</p>
      </div>
    );
  }

  const getProfileImage = (item) =>
    item.profileImage?.E || "/default-avatar.png";

  return (
    <div className={`p-4 overflow-x-auto mx-14     mt-9 ${direction}`}>
      <table
        className="table-auto w-full text-sm text-center  dark:text-gray-400 shadow-lg rounded-xl"
        dir={direction}
      >
        <thead className=" text-center text-xl font-semibold uppercase bg-gray-50 ">
          <tr className="text-center ml-9">
            <th scope="col" className="px-4 py-2 text-lg">
              {t("subjectInfo.subjectTitle")}
            </th>
            <th className="px-4 py-2  text-center">
              {" "}
              {t("subjectCardDashboard.subjectNum")}{" "}
            </th>{" "}
            <th scope="col" className="px-4 py-2 text-lg">
              {t("subjectInfo.action")}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredSubjects.map((item, index) => (
            <tr
              key={item.id}
              className={`${
                index % 2 === 0 ? "bg-[#DEBA9A]" : "bg-white"
              } border-b text-xl font-semibold`}
            >
              <td className="px-4 py-3 font-semibold  dark:text-white whitespace-nowrap">
                {item.subjectTitle}
              </td>
              <td className="px-4 py-2 text-center font-semibold">
                {t("subjectCardDashboard.subjectNum")}: {item.subjectNum}
              </td>
              <td className="px-4 py-3">
                <button
                  className={` hover:underline  font-semibold`}
                  onClick={() => handleButtonClick(item)}
                >
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
