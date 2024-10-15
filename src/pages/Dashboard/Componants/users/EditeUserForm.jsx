/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { Button, FileInput, Label, TextInput } from "flowbite-react";
import { useNavigate, useLocation } from "react-router-dom";
import { getFirestore, doc, updateDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useTranslation } from "react-i18next";
import Topbanner from "../../../Home/componants/banner/Topbanner";
import Bottombanner from "../../../Home/componants/banner/Bottombanner";
import "../../../Home/Card.css";
import SideBar from "../../SideBar";
import { IoArrowBack } from "react-icons/io5";
export default function EditUserForm() {
  const { t, i18n } = useTranslation("global");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const location = useLocation();
  const user = location.state?.user;
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const [userData, setUserData] = useState({
    employeeName: "",
    employeeId: "",
    hireDate: "",
    jobGrade: "",
    department: "",
    officeNumber: "",
    jobTitle: "",
    phoneNumber: "",
    currentOffice: "",
    profileImage: "",
    employeeEmail: "",
  });

  const employeeFileRef = useRef(null);

  useEffect(() => {
    if (user) {
      setUserData(user);
    } else {
      console.log("No user data provided!");
    }
  }, [user]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserData((prevUser) => ({
      ...prevUser,
      [id]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const db = getFirestore();
      let updatedUserData = { ...userData };

      const employeeImage = employeeFileRef.current?.files[0];
      if (employeeImage) {
        const storage = getStorage();
        const storageRef = ref(
          storage,
          `employees/${userData.employeeId}/profile.jpg`
        );
        await uploadBytes(storageRef, employeeImage);
        const imageURL = await getDownloadURL(storageRef);
        updatedUserData.profileImage = imageURL;
      }

      const userId = userData.id;
      await setDoc(doc(db, "employees", user.id), updatedUserData);

      // navigate("/dashboard");
      setIsPopupVisible(true);
    } catch (error) {
      console.error("Error saving data: ", error);
      alert("An error occurred while saving the data. Please try again.");
    }
  };

  console.log("Employee ID:", userData.employeeId);

  const handleEmployeeImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setUserData((prevUser) => ({ ...prevUser, profileImage: imageURL }));
    }
  };

  const fields = [
    { id: "employeeName", label: t("userform.employeeName") },
    { id: "employeeId", label: t("userform.employeeId") },
    { id: "hireDate", label: t("userform.hireDate") },
    { id: "jobGrade", label: t("userform.jobGrade") },
    { id: "department", label: t("userform.department") },
    { id: "officeNumber", label: t("userform.officeNumber") },
    { id: "jobTitle", label: t("userform.jobTitle") },
    { id: "phoneNumber", label: t("userform.phoneNumber") },
    { id: "currentOffice", label: t("userform.currentOffice") },
    { id: "employeeEmail", label: t("userform.email") },
  ];
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div>
      <Topbanner />
      <div
      className="   "
      dir={direction}
      
    >
        <button className="text-center bg-[#CDA03D] py-2 px-9 shadow-xl m-9 rounded-full text-white flex  text-lg font-bold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300" onClick={handleBack} dir={direction} style={{marginTop:"400px"}}>
        <IoArrowBack className="mt-1 mr-3" />  {t("text.back")}
            </button></div>
      <div
        className="  justify-center flex"
  
      >
        <div className=" p-8 w-full max-w-5xl  " style={{paddingBottom:"400px"}}>
          <h1
            className=" text-3xl font-semibold text-white bg-[#CDA03D] p-5 rounded-t-xl"
            dir={direction}
          >
            {t("userform.edittitle")}
          </h1>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex flex-col items-center mb-6">
              <Label
                htmlFor="upload-file"
                className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
              >
                <FileInput
                  id="upload-file"
                  ref={employeeFileRef}
                  className="hidden"
                  onChange={handleEmployeeImageChange}
                />
                <div className="flex items-center justify-center h-full w-full">
                  {userData.profileImage ? (
                    <img
                      src={userData.profileImage}
                      alt="Employee Profile"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <svg
                      className="h-5 w-5 text-gray-500"
                      aria-hidden="true"
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
                  )}
                </div>
              </Label>
              <p className="text-center mt-2 text-xl text-gray-500 font-semibold">
                {t("userform.empimg")}
              </p>
            </div>

            <div
              className=" grid grid-cols-1 md:grid-cols-2 gap-6"
              dir={direction}
            >
              {fields.map(({ id, label }) => (
                <FormField
                  key={id}
                  label={label}
                  id={id}
                  value={userData[id]}
                  onChange={handleChange}
                />
              ))}
            </div>
          </div>

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
      </div>{" "}
      <Bottombanner />
    </div>
  );
}

const FormField = ({ label, id, value, onChange, type = "text" }) => (
  <div>
    <Label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </Label>
    <TextInput
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      className="mt-1"
    />
  </div>
);
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
