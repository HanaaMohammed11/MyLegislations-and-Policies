import  { useEffect, useState, useRef } from "react";
import { FileInput, Label, TextInput } from "flowbite-react";
import { useNavigate, useLocation } from "react-router-dom";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useTranslation } from "react-i18next";
import Topbanner from "../../../Home/componants/banner/Topbanner";
import Bottombanner from "../../../Home/componants/banner/Bottombanner";
import "../../../Home/Card.css";
import SideBar from "../../SideBar";
import { IoArrowBack } from "react-icons/io5";

const FormField = ({ id, label, value, onChange }) => (
  <div>
    <Label htmlFor={id} value={label} />
    <TextInput id={id} value={value} onChange={onChange} />
  </div>
);

export default function EditProxyrForm() {
  const { t, i18n } = useTranslation("global");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const location = useLocation();
  const user = location.state?.user;
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    proxyEmployeeName: "",
    proxyEmployeeId: "",
    proxyHireDate: "",
    proxyJobGrade: "",
    proxyDepartment: "",
    proxyOfficeNumber: "",
    proxyJobTitle: "",
    proxyPhoneNumber: "",
    proxyCurrentOffice: "",
    proxyProfileImage: "",
    proxyEmail: ""
  });

  const proxyemployeeFileRef = useRef(null);

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

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const db = getFirestore();
      let updatedUserData = { ...userData };

      const proxyemployeeImage = proxyemployeeFileRef.current?.files[0];
      if (proxyemployeeImage) {
        const storage = getStorage();
        const storageRef = ref(
          storage,
          `employees/${userData.proxyEmployeeId}/profile.jpg`
        );
        await uploadBytes(storageRef, proxyemployeeImage);
        const imageURL = await getDownloadURL(storageRef);
        updatedUserData.proxyProfileImage = imageURL;
      }

      const userId = userData.proxyEmployeeId;
      await setDoc(doc(db, "proxyEmployees", userId), updatedUserData);

      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving data: ", error);
      alert("An error occurred while saving the data. Please try again.");
    }
  };

  const handleEmployeeImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setUserData((prevUser) => ({ ...prevUser, proxyProfileImage: imageURL }));
    }
  };

  const fields = [
    { id: "proxyEmployeeName", label: t("userform.proxyEmployeeName") },
    { id: "proxyEmployeeId", label: t("userform.proxyEmployeeId") },
    { id: "proxyHireDate", label: t("userform.proxyHireDate") },
    { id: "proxyJobGrade", label: t("userform.proxyJobGrade") },
    { id: "proxyDepartment", label: t("userform.proxyDepartment") },
    { id: "proxyOfficeNumber", label: t("userform.proxyOfficeNumber") },
    { id: "proxyJobTitle", label: t("userform.proxyJobTitle") },
    { id: "proxyPhoneNumber", label: t("userform.proxyPhoneNumber") },
    { id: "proxyCurrentOffice", label: t("userform.proxyCurrentOffice") },
    { id: "proxyEmail", label: t("userform.proxyEmail") }
  ];
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div>
      <Topbanner/>
      <div
      className="   "
      dir={direction}
      
    >
        <button className="text-center bg-[#CDA03D] py-2 px-9 shadow-xl m-9 rounded-full text-white flex  text-lg font-bold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300" onClick={handleBack} dir={direction} style={{marginTop:"400px"}}>
        <IoArrowBack className="mt-1 mr-3" />  {t("text.back")}
            </button></div>
    <div className="flex justify-center items-center pb-[200px]" >
    <div className="bg-white p-8 rounded-lg shadow-md  w-full max-w-5xl ">
      <form onSubmit={handleSave}>
      <div className="flex flex-col items-center mb-6 ">
  <Label
    htmlFor="upload-file"
    className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
  >
    <FileInput
      id="upload-file"
      ref={proxyemployeeFileRef}
      className="hidden"
      onChange={handleEmployeeImageChange}
    />
    <div className="flex items-center justify-center h-full w-full">
      {userData.proxyProfileImage ? (
        <img
          src={userData.proxyProfileImage}
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


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" dir={direction}>
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
<div className="flex justify-center">
<button
          type="submit"
          className={`aux-button aux-curve aux-gold flex items-center justify-center text-lg font-bold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300 `}        
         
        >
               <span className="flex items-center space-x-4 aux-text">{t("subjectEditForm.save")}</span>
               </button>
       
</div>
       
      </form>
    </div>
    </div>
    <Bottombanner/></div>
  );
}
