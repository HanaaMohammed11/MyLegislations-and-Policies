/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Button, Label, Textarea, TextInput, Select } from "flowbite-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  collection,
  doc,
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
  const [employees, setEmployees] = useState([]);
  const { t, i18n } = useTranslation("global");
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const [subjectData, setSubjectData] = useState({
    subjectNum: subject.subjectNum || "",
    subjectField: subject.subjectField || "",
    subjectTitle: subject.subjectTitle || "",
    subjectContent: subject.subjectContent || "",
    relatedMatrix: subject.relatedMatrix || "",
    emp1: subject.emp1 || "",
    sharedEmployees: subject.sharedEmployees || [{ empId: "", role: "" }],
    notes: subject.notes || "",
    negotiationLimit: subject.negotiationLimit || "",
  });

  // Handle form input change for subject data
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setSubjectData({ ...subjectData, [id]: value });
  };

  // Handle shared employee change
  const handleSharedEmployeeChange = (index, field, value) => {
    const updatedEmployees = subjectData.sharedEmployees.map((employee, i) =>
      i === index ? { ...employee, [field]: value } : employee
    );
    setSubjectData({ ...subjectData, sharedEmployees: updatedEmployees });
  };

  // Add new shared employee
  const handleAddSharedEmployee = () => {
    setSubjectData((prevState) => ({
      ...prevState,
      sharedEmployees: [...prevState.sharedEmployees, { empId: "", role: "" }],
    }));
  };

  // Remove shared employee
  const handleRemoveSharedEmployee = (index) => {
    const updatedEmployees = subjectData.sharedEmployees.filter(
      (_, i) => i !== index
    );
    setSubjectData({ ...subjectData, sharedEmployees: updatedEmployees });
  };

  // Save updated subject data
  const handleSave = async () => {
    const subjectRef = doc(db, "subjects", subject.id);

    try {
      await updateDoc(subjectRef, subjectData);
      // navigate("/dashboard");
      setIsPopupVisible(true);
    } catch (error) {
      console.error("Error updating subject:", error);
    }
  };

  useEffect(() => {
    // const matrixCollectionRef = collection(db, "matrix");
    const qMatrix = query(
      collection(db, "matrix"),
      where("ownerAdmin", "==", localStorage.getItem("id"))
    );
    const unsubscribeMatrix = onSnapshot(qMatrix, (snapshot) => {
      const matrixList = [];
      snapshot.forEach((doc) => matrixList.push({ id: doc.id, ...doc.data() }));
      setMatrix(matrixList);
    });

    // Fetch employee data
    // const employeesCollectionRef = collection(db, "employees");
    const qEmps = query(
      collection(db, "employees"),
      where("ownerAdmin", "==", localStorage.getItem("id"))
    );
    const unsubscribeEmployees = onSnapshot(qEmps, (snapshot) => {
      const employeeList = [];
      snapshot.forEach((doc) =>
        employeeList.push({ id: doc.id, ...doc.data() })
      );
      setEmployees(employeeList);
    });

    return () => {
      unsubscribeMatrix();
      unsubscribeEmployees();
    };
  }, []);
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div>
      <Topbanner />
      <div className="   " dir={direction}>
        <button
          className="text-center bg-[#CDA03D]  py-2 px-9 shadow-xl m-9 rounded-full text-white flex  text-lg font-bold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300"
          onClick={handleBack}
          dir={direction}
          style={{ marginTop: "400px" }}
        >
          <IoArrowBack className="mt-1 mr-3" /> {t("text.back")}
        </button>
      </div>
      <div className="flex" dir={direction} style={{ paddingBottom: "400px" }}>
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

              {/* Negotiation Limit */}
              <div className="col-span-2">
                <Label
                  htmlFor="negotiationLimit"
                  value={t("subjectEditForm.negotiationLimit")}
                  className="text-xl font-semibold"
                />
                <TextInput
                  id="negotiationLimit"
                  type="text"
                  className="mt-2"
                  value={subjectData.negotiationLimit}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Related Matrix */}
            <div className=" col-span-2 pt-8" dir={direction}>
              <Label
                htmlFor="relatedMatrix"
                value={t("subjectEditForm.relatedMatrix")}
                className="text-xl font-semibold"
              />
              <Select
                id="relatedMatrix"
                className="mt-2"
                value={subjectData.relatedMatrix.title || ""}
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

            {/* Assigned Employee */}
            <div className=" col-span-2 pt-8" dir={direction}>
              <Label
                htmlFor="emp1"
                value={t("subjectEditForm.hiredEmp")}
                className="text-xl font-semibold"
              />
              <Select
                id="emp1"
                className="mt-2"
                value={subjectData.emp1.employeeName || ""}
                onChange={(e) => {
                  const selectedEmployee = employees.find(
                    (item) => item.employeeName === e.target.value
                  );
                  setSubjectData({ ...subjectData, emp1: selectedEmployee });
                }}
              >
                <option value="" disabled>
                  {t("subjectEditForm.chooseEmp")}
                </option>
                {employees.map((item) => (
                  <option key={item.id} value={item.employeeName}>
                    {item.employeeName}
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

            {/* Shared Employees */}
            <div className=" col-span-2 pt-8" dir={direction}>
              <Label
                value={t("subjectEditForm.sharedEmployees")}
                className="text-xl font-semibold"
              />
              {subjectData.sharedEmployees.map((sharedEmployee, index) => (
                <div
                  key={index}
                  className="flex gap-4 mt-2 xs:flex-col sm:flex-row xs:items-center"
                >
                  <Select
                    className="w-1/2"
                    value={sharedEmployee.role}
                    onChange={(e) =>
                      handleSharedEmployeeChange(index, "role", e.target.value)
                    }
                  >
                    <option value="" disabled>
                      {t("subjectEditForm.chooseRole")}
                    </option>
                    <option value="منفردين">
                      {t("subjectEditForm.single")}
                    </option>
                    <option value="مجتمعين">
                      {t("subjectEditForm.grouped")}
                    </option>
                  </Select>

                  <Select
                    className="w-1/2"
                    value={sharedEmployee.empId}
                    onChange={(e) =>
                      handleSharedEmployeeChange(index, "empId", e.target.value)
                    }
                  >
                    <option value="" disabled>
                      {t("subjectEditForm.chooseEmp")}
                    </option>
                    {employees.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.employeeName}
                      </option>
                    ))}
                  </Select>

                  {/* Remove Employee Button */}
                  <Button
                    color="failure"
                    onClick={() => handleRemoveSharedEmployee(index)}
                  >
                    {t("subjectEditForm.delete")}
                  </Button>
                </div>
              ))}

              {/* Add New Employee Button */}
              <Button className="mt-4" onClick={handleAddSharedEmployee}>
                {t("subjectEditForm.addNewEmp")}
              </Button>
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
