/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Button, FileInput, Label, TextInput } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useTranslation } from "react-i18next";
import "../../../Home/Card.css";
export default function UserForm({ onClose }) {
  const { t, i18n } = useTranslation("global");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const navigation = useNavigate();
  const [employeeImageURL, setEmployeeImageURL] = useState(null);
  const [proxyEmployees, setProxyEmployees] = useState([{ imageURL: null }]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleSave = async () => {
    try {
      const storage = getStorage();
      const db = getFirestore();

      const employeeData = {
        ownerAdmin: localStorage.getItem("id"),
        employeeName: document.getElementById("employee-name").value,
        employeeId: document.getElementById("employee-id").value,
        hireDate: document.getElementById("hire-date").value,
        jobGrade: document.getElementById("job-grade").value,
        department: document.getElementById("department").value,
        officeNumber: document.getElementById("office-number").value,
        jobTitle: document.getElementById("job-title").value,
        phoneNumber: document.getElementById("phone-number").value,
        currentOffice: document.getElementById("current-office").value,
        employeeEmail: document.getElementById("email").value,

        proxyEmployeeIds: [],
      };

      const employeeImage = document.getElementById("upload-file").files[0];
      if (employeeImage) {
        const storageRef = ref(
          storage,
          `employees/${employeeData.employeeId}/profile.jpg`
        );
        await uploadBytes(storageRef, employeeImage);
        const imageURL = await getDownloadURL(storageRef);
        employeeData.profileImage = imageURL;
      }

      const proxyEmployeeIds = await Promise.all(
        proxyEmployees.map(async (proxyEmployee, index) => {
          const proxyEmployeeData = {
            ownerAdmin: localStorage.getItem("id"),
            proxyEmployeeName: document.getElementById(
              `proxy-employee-name-${index}`
            ).value,
            proxyEmployeeId: document.getElementById(
              `proxy-employee-id-${index}`
            ).value,
            proxyHireDate: document.getElementById(`proxy-hire-date-${index}`)
              .value,
            proxyJobGrade: document.getElementById(`proxy-job-grade-${index}`)
              .value,
            proxyDepartment: document.getElementById(
              `proxy-department-${index}`
            ).value,
            proxyOfficeNumber: document.getElementById(
              `proxy-office-number-${index}`
            ).value,
            proxyJobTitle: document.getElementById(`proxy-job-title-${index}`)
              .value,
            proxyPhoneNumber: document.getElementById(
              `proxy-phone-number-${index}`
            ).value,
            proxyCurrentOffice: document.getElementById(
              `proxy-current-office-${index}`
            ).value,
            proxyEmail: document.getElementById(`proxy-email-${index}`).value,
          };

          const proxyEmployeeImage = document.getElementById(
            `upload-file-proxy-${index}`
          ).files[0];
          if (proxyEmployeeImage) {
            const proxyStorageRef = ref(
              storage,
              `proxyEmployees/${proxyEmployeeData.proxyEmployeeId}/profile.jpg`
            );
            await uploadBytes(proxyStorageRef, proxyEmployeeImage);
            const proxyImageURL = await getDownloadURL(proxyStorageRef);
            proxyEmployeeData.proxyProfileImage = proxyImageURL;
          }

          const proxyDocRef = await addDoc(
            collection(db, "proxyEmployees"),
            proxyEmployeeData
          );
          return proxyDocRef.id;
        })
      );

      employeeData.proxyEmployeeIds = proxyEmployeeIds;

      const employeeDocRef = await addDoc(
        collection(db, "employees"),
        employeeData
      );
      console.log("Employee document written with ID: ", employeeDocRef.id);

      // navigation("/dashboard");

      setIsPopupVisible(true);
      onClose();
    } catch (error) {
      console.error("Error saving data: ", error);
    }
  };
  const closePopup = () => {
    setIsPopupVisible(false); 
  };
  const handleProxyEmployeeImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      const updatedProxyEmployees = [...proxyEmployees];
      updatedProxyEmployees[index].imageURL = imageURL;
      setProxyEmployees(updatedProxyEmployees);
    }
  };

  const addProxyEmployee = () => {
    setProxyEmployees([...proxyEmployees, { imageURL: null }]);
  };

  return (
    <div
      className="flex lg:w-[900px] md:w-[500px] lg:mt-10 md:mt-10 mt-44 sm:mt-44   "
      style={{ paddingBottom: "400px" }}
    >
      <div className="mx-auto xs:py-2 sm:p-8 w-full max-w-5xl">
        <h1
          className="text-3xl font-semibold text-white bg-[#CDA03D] p-5 rounded-t-xl"
          dir={direction}
        >
          {t("userform.adduser")}
        </h1>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex flex-col items-center mb-6">
            <Label
              htmlFor="upload-file"
              className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
            >
              <FileInput
                id="upload-file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const imageURL = URL.createObjectURL(file);
                    setEmployeeImageURL(imageURL);
                  }
                }}
              />
              {employeeImageURL ? (
                <img
                  src={employeeImageURL}
                  alt="Employee"
                  className="rounded-full h-full w-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full">
                  <svg
                    className="h-5 w-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                </div>
              )}
            </Label>

            <p className="text-center mt-2 text-xl text-gray-500 font-semibold">
              {t("userform.empimg")}
            </p>
          </div>

          {/* Form Fields */}
          <div
            className=" grid grid-cols-1 md:grid-cols-2 gap-6"
            dir={direction}
          >
            <FormField label={t("userform.employeeName")} id="employee-name" />
            <FormField label={t("userform.employeeId")} id="employee-id" />
            <FormField
              label={t("userform.hireDate")}
              id="hire-date"
              type="date"
            />
            <FormField label={t("userform.jobGrade")} id="job-grade" />
            <FormField label={t("userform.department")} id="department" />
            <FormField label={t("userform.officeNumber")} id="office-number" />
            <FormField label={t("userform.jobTitle")} id="job-title" />
            <FormField label={t("userform.phoneNumber")} id="phone-number" />
            <FormField
              label={t("userform.currentOffice")}
              id="current-office"
            />
            <FormField label={t("userform.email")} id="email" />
          </div>
        </div>
        {/* Proxy Employee Section */}
        <h2
          className=" text-2xl font-semibold text-white bg-[#CDA03D] p-5 rounded-t-xl mt-9"
          dir={direction}
        >
          {t("userform.title")}
        </h2>
        {proxyEmployees.map((proxyEmployee, index) => (
          <div className="bg-white p-8 rounded-lg shadow-md mb-6" key={index}>
            {/* Upload Section for Proxy */}
            <div className="flex flex-col items-center mb-6">
              <Label
                htmlFor={`upload-file-proxy-${index}`}
                className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
              >
                <FileInput
                  id={`upload-file-proxy-${index}`}
                  className="hidden"
                  onChange={(e) => handleProxyEmployeeImageChange(index, e)}
                />
                {proxyEmployee.imageURL ? (
                  <img
                    src={proxyEmployee.imageURL}
                    alt="Proxy Employee"
                    className="rounded-full h-full w-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full">
                    <svg
                      className="h-5 w-5 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                  </div>
                )}
              </Label>
              <p className="text-center mt-2 text-xl text-gray-500 font-semibold">
                {t("userform.empimg")}{" "}
              </p>
            </div>

            {/* Proxy Employee Form Fields */}
            <div
              dir={direction}
              className=" grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <FormField
                label={t("userform.proxyEmployeeName")}
                id={`proxy-employee-name-${index}`}
              />
              <FormField
                label={t("userform.proxyEmployeeId")}
                id={`proxy-employee-id-${index}`}
              />
              <FormField
                label={t("userform.proxyHireDate")}
                id={`proxy-hire-date-${index}`}
                type="date"
              />
              <FormField
                label={t("userform.proxyJobGrade")}
                id={`proxy-job-grade-${index}`}
              />
              <FormField
                label={t("userform.proxyDepartment")}
                id={`proxy-department-${index}`}
              />
              <FormField
                label={t("userform.proxyOfficeNumber")}
                id={`proxy-office-number-${index}`}
              />
              <FormField
                label={t("userform.proxyJobTitle")}
                id={`proxy-job-title-${index}`}
              />
              <FormField
                label={t("userform.proxyPhoneNumber")}
                id={`proxy-phone-number-${index}`}
              />
              <FormField
                label={t("userform.proxyCurrentOffice")}
                id={`proxy-current-office-${index}`}
              />
              <FormField
                label={t("userform.proxyEmail")}
                id={`proxy-email-${index}`}
              />
            </div>
          </div>
        ))}
        <div className="flex justify-end">
          <Button onClick={addProxyEmployee} className="mt-4">
            {t("userform.appproxy")}
          </Button>
        </div>
        {/* Save Button */}{" "}
        {isPopupVisible && (
          <div style={popupStyles}>
            <div style={popupContentStyles}>
            <p>{t("matrixForm.alert")}</p>
              <button
                    onClick={() => {
                      setIsPopupVisible(false);
                      navigation(-1);
                    }}
                    className="text-red-600"
                  >
                    {t("text.close")}
                  </button>
            </div>
          </div>
        )}
      
        <div className="flex justify-center ">
          <div className="mt-6 flex justify-center">
            <div
              onClick={handleSave}
              className={`aux-button aux-curve aux-gold flex items-center justify-center text-lg font-bold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300 `}
            >
              <span className="flex items-center space-x-4 aux-text">
                {t("subjectEditForm.save")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, id, type = "text" }) {
  return (
    <div>
      <Label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-gray-700"
      >
        {label}
      </Label>
      <TextInput
        type={type}
        id={id}
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
      />
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
