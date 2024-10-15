/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from "react";
import { Button, Card } from "flowbite-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import db from "../../../../config/firebase";
import { useTranslation } from "react-i18next";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Topbanner from "../../../Home/componants/banner/Topbanner";
import { IoArrowBack } from "react-icons/io5";
import Bottombanner from "../../../Home/componants/banner/Bottombanner";

export default function AdminSubjectInfo() {
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

  const { t, i18n } = useTranslation("global");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const location = useLocation();
  const navigate = useNavigate();
  const subject = location.state?.subject;
  const [employees, setEmployees] = useState([]);
  const [matrices, setMatrices] = useState([]);
  useEffect(() => {
    const qUser = query(collection(db, "matrix"), where("title", "!=", 0));
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

        const employeesSnapshot = await getDocs(collection(db, "employees"));
        const employeesList = employeesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setEmployees(employeesList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [subject]);

  const emp1 = employees.find((emp) => emp.employeeId === subject.emp1Id);
  const emp2 = employees.find((emp) => emp.employeeId === subject.emp2Id);
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <Topbanner />
      <div dir={direction}>
        <button
          style={{ marginTop: "400px" }}
          className="text-center bg-[#CDA03D] py-2 px-9 shadow-xl m-9 rounded-full text-white flex text-lg font-bold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300"
          onClick={handleBack}
        >
          <IoArrowBack className="mt-1 mr-3" /> {t("text.back")}
        </button>
      </div>
      <div className="mt-28 justify-center mb-[30%] flex subjects-center">
        <Card className="w-[1200px]">
          <div className="flex justify-end px-4 pt-4"></div>
          <div className="flex flex-col subjects-center pb-10">
            <div className="mt-4 w-full">
              <Button
                onClick={downloadPDF}
                className="bg-[#d4af37] rounded-full"
              >
                {" "}
                {t("text.download")}
              </Button>

              <table
                className="min-w-full border-collapse table-fixed"
                dir={direction}
                ref={pdfRef}
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
                    className="cursor-pointer hover:bg-[#fce8ca]"
                    onClick={() => {
                      const matrix = matrices.find(
                        (item) => item.title === subject.relatedMatrix.title
                      );
                      console.log(matrix);

                      navigate("/MatrixInfo", {
                        state: { matrix },
                      });
                    }}
                  >
                    <td className="px-4 py-2 font-bold w-1/2">
                      {t("subjectEditForm.relatedMatrix")}
                    </td>
                    <td className="px-4 py-2 break-words w-1/2 overflow-hidden ">
                      {subject.relatedMatrix.title}
                    </td>
                  </tr>
                  <tr className="bg-[#fce8ca]">
                    <td className="px-4 py-2 font-bold w-1/2">
                      {t("subjectInfo.authorizedEmployee")}
                    </td>
                    <td className="px-4 py-2 break-words w-1/2">
                      {subject.emp1.employeeName} - {subject.emp1.jobTitle}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-bold w-1/2">
                      {t("subjectInfo.sharedEmployees")}
                    </td>
                    <td className="px-4 py-2 break-words w-1/2">
                      {emp2?.employeeName} - {emp2?.role}
                    </td>
                  </tr>
                  {subject.sharedEmployees.length > 0 ? (
                    subject.sharedEmployees.map((emp) => {
                      const user = employees.find(
                        (empl) => empl.employeeId === emp.empId
                      );
                      return (
                        <tr
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => {
                            if (user) {
                              navigate("/userinfo", { state: { user } });
                            }
                          }}
                          key={emp.empId}
                        >
                          <td className="px-4 py-2 break-words w-1/2">
                            {emp.role}
                          </td>
                          <td className="px-4 py-2 break-words w-1/2">
                            {user ? user.employeeName : ""}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={2} className="px-4 py-2 text-center">
                        {t("subjectInfo.noRelatedSubjects")}
                      </td>
                    </tr>
                  )}
                  <tr className="bg-[#fce8ca]">
                    <td className="px-4 py-2 font-bold w-1/2">
                      {t("subjectEditForm.negotiationLimit")}
                    </td>
                    <td className="px-4 py-2 break-words w-1/2">
                      {subject.negotiationLimit}
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
      <Bottombanner />
    </div>
  );
}
