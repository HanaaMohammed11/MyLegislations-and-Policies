import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button } from "flowbite-react";

import { getFirestore, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import Topbanner from "../../Home/componants/banner/Topbanner";
import Bottombanner from "../../Home/componants/banner/Bottombanner";
import { useTranslation } from "react-i18next";
import { IoArrowBack } from "react-icons/io5";

export default function UerProxy() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state.user;
  const mainUserId = location.state.mainUser;
  const { t, i18n } = useTranslation("global");

  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  console.log(mainUserId);



  const [proxyEmployees, setProxyEmployees] = useState(user.proxyEmployees || []);

  


  const handleBack = () => {
    navigate(-1);
  };


  return (
    <div>
      <Topbanner />
      <div dir={direction}>  <button className="text-center bg-[#CDA03D] py-2 px-9 shadow-xl m-9 rounded-full text-white flex  text-lg font-bold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300" onClick={handleBack} dir={direction} style={{  marginTop: "300px",
    }}>
        <IoArrowBack className="mt-1 mr-3" />  {t("text.back")}
            </button></div>
      <div className="min-h-screen flex items-center justify-center" dir={direction} style={{  paddingTop: "2px",
      paddingBottom: "400px"}}>
   
  <Card className="w-full max-w-[900px] h-auto my-12"   >
    <div className="flex flex-col items-center pb-10">
    <div style={profileContainerStyle}>
      <img
        alt="User Avatar"
        src={user.profileImage || user.proxyProfileImage || "https://www.lightsong.net/wp-content/uploads/2020/12/blank-profile-circle.png"}
        style={imageStyle}
      />
    </div>  
      <div className="mt-4 overflow-x-auto w-full">
        <table className="border-collapse w-full">
          <tbody className="text-gray-700">
            <tr>
              <td className="px-4 py-2 font-bold">{t('userInfo.employeeName')}</td>
              <td className="px-4 py-2">{user.employeeName || user.proxyEmployeeName}</td>
            </tr>
            <tr className="bg-[#DEBA9A]">
              <td className="px-4 py-2 font-bold">{t('userInfo.employeeId')}</td>
              <td className="px-4 py-2">{user.employeeId || user.proxyEmployeeId}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-bold">{t('userInfo.hireDate')}</td>
              <td className="px-4 py-2">{user.hiringDate || user.proxyHireDate}</td>
            </tr>
            <tr className="bg-[#DEBA9A]">
              <td className="px-4 py-2 font-bold">{t('userInfo.jobGrade')}</td>
              <td className="px-4 py-2">{user.jobGrade || user.proxyJobGrade}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-bold">{t('userInfo.department')}</td>
              <td className="px-4 py-2">{user.department || user.proxyDepartment}</td>
            </tr>
            <tr className="bg-[#DEBA9A]">
              <td className="px-4 py-2 font-bold">{t('userInfo.officeNumber')}</td>
              <td className="px-4 py-2">{user.officeNumber || user.proxyOfficeNumber}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-bold">{t('userInfo.jobTitle')}</td>
              <td className="px-4 py-2">{user.jobTitle || user.proxyJobTitle}</td>
            </tr>
            <tr className="bg-[#DEBA9A]">
              <td className="px-4 py-2 font-bold">{t('userInfo.phoneNumber')}</td>
              <td className="px-4 py-2">{user.phoneNumber || user.proxyPhoneNumber}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-bold">{t('userInfo.email')}</td>
              <td className="px-4 py-2">{user.employeeEmail || user.proxyEmail}</td>
            </tr>
            <tr className="bg-[#DEBA9A]">
              <td className="px-4 py-2 font-bold">{t('userInfo.currentOffice')}</td>
              <td className="px-4 py-2">{user.currentOffice || user.proxyCurrentOffice}</td>
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

const profileContainerStyle = {
  margin: 'auto',
  width: '10vw', // عرض متجاوب، يمكن تعديله حسب الحاجة
  height: '10vw', // ارتفاع متجاوب
  maxWidth: '250px', // حد أقصى للعرض
  maxHeight: '250px', // حد أقصى للارتفاع
  minWidth: '50px', // حد أدنى للعرض
  minHeight: '50px', // حد أدنى للارتفاع
  position: 'relative',
  borderRadius: '50%',
  border: '15px solid transparent',
  background: 'linear-gradient(white, white) padding-box, linear-gradient(45deg, #FFD700 10%, #DAA520 10%, #C0C0C0 100%) border-box', // الخلفية الذهبية

};

// أنماط الصورة
const imageStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '50%', 
  display: 'block',
};

// يمكنك إضافة أنماط CSS أدناه
const style = `

  }
`;
document.head.insertAdjacentHTML("beforeend", `<style>${style}</style>`);