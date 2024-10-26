/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { Button, Card } from "flowbite-react";
import Topbanner from "../../Home/componants/banner/Topbanner";
import Bottombanner from "../../Home/componants/banner/Bottombanner";
import { useLocation, useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import db from "../../../config/firebase";
import { useTranslation } from "react-i18next";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { IoArrowBack } from "react-icons/io5";
import { nav } from "framer-motion/client";
export default function SubjectInfo({
  subject,
  onBack,
  onMatrixClick,
  onEmpClick,
}) {
  const { t, i18n } = useTranslation("global");
  const pdfRef = useRef();

  const downloadPDF = () => {
    const input = pdfRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const pdfWidth = imgWidth / 1;
      const pdfHeight = (imgHeight * pdfWidth) / imgWidth;

      const doc = new jsPDF({
        orientation: imgWidth > imgHeight ? "landscape" : "portrait",
        unit: "px",
        format: [imgWidth, imgHeight],
      });

      doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      doc.save("table.pdf");
    });
  };
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const location = useLocation();
  const navigate = useNavigate();

  const [matrices, setMatrices] = useState([]);

  console.log(subject.relatedLegislation.title);
  useEffect(() => {
    const qUser = query(
      collection(db, "legislations"),
      where("intro", "!=", 0)
    );
    const unsubscribe = onSnapshot(qUser, (snapshot) => {
      const matrix = [];
      snapshot.forEach((doc) => {
        matrix.push({ docId: doc.id, ...doc.data() });
      });
      setMatrices(matrix);
    });

    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!subject) {
          console.error("No subject data found in location state");
          return;
        }

        setSubject(subject);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [subject]);

  const handleBack = () => {
    navigate(-1);
  };


  return (
    <div>
      <Topbanner />
      <div dir={direction} style={{ marginLeft: 20 }}>
        <button
          className="text-center bg-[#CDA03D] fixed py-2 px-3 shadow-xl rounded-full text-white flex  text-lg font-bold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300"
          onClick={onBack}
          dir={direction}
        >
          <IoArrowBack className="" /> 
        </button>
      </div>
      <div
        className="mt-[50px] justify-center flex items-center"
        style={{ paddingTop: "2px", paddingBottom: "440px" }}
      >
        <Card className="lg:w-[1200px] ">
          <div className=" w-full" dir={direction}>
            <Button onClick={downloadPDF} className="bg-[#d4af37] rounded-full">
              {t("text.download")}
            </Button>
          </div>
          <div className="flex justify-end px-4 pt-4"></div>
          <div className="flex flex-col items-center pb-10">
            {/* الجدول */}
            <div className=" w-full" ref={pdfRef}>
              <table
                className="min-w-full  border-collapse table-fixed"
                dir={direction}
              >
                <tbody className="text-gray-700">
                  <tr>
                    <td className="px-4 py-2 font-bold w-1/2">
                      {t("subjectEditForm.subjectNum")}
                    </td>
                    <td className="px-4 py-2 break-words w-1/2">
                      {subject.subjectNum}
                    </td>
                  </tr>
                  <tr className="bg-[#fce8ca]">
                    <td className="px-4 py-2 font-bold w-1/2">
                      {t("subjectEditForm.subjectTitle")}
                    </td>
                    <td className="px-4 py-2 break-words w-1/2">
                      {subject.subjectTitle}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-bold w-1/2">
                      {t("subjectEditForm.subjectContent")}
                    </td>
                    <td className="px-4 py-2 break-words w-1/2 overflow-hidden">
                      {subject.subjectContent}
                    </td>
                  </tr>
                  <tr
                    className="cursor-pointer bg-[#fce8ca] hover:bg-[#fce8ca]"
                    onClick={() => {
                      const matrix = matrices.find(
                        (item) => item.title === subject.relatedLegislation.title
                      );
                      onMatrixClick(matrix);
                      // navigate("/MatrixInfo", {
                      //   state: { matrix },
                      // });
                    }}
                  >
                    <td className="px-4 py-2 font-bold w-1/2">
                      {t("subjectEditForm.relatedLegislations")}
                    </td>
                    <td className="px-4 py-2 break-words w-1/2 overflow-hidden ">
                      {subject.relatedLegislation.title}
                    </td>
                  </tr>

                  <tr>
                    <td className="px-4 py-2 font-bold w-1/2">
                      {t("subjectInfo.notes")}
                    </td>
                    <td className="px-4 py-2 break-words w-1/2 overflow-hidden">
                      {subject.notes}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>

    </div>
  );
}
