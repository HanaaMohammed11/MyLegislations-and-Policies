import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button } from "flowbite-react";
import Topbanner from "./../../../Home/componants/banner/Topbanner";
import Bottombanner from "./../../../Home/componants/banner/Bottombanner";
import { getFirestore, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import SideBar from "../../SideBar";
import { IoArrowBack } from "react-icons/io5";

export default function Proxyemployeeinfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state.user;
  const mainUserId = location.state.mainUser;

  const [refresh, setRefresh] = useState(false);
  console.log(mainUserId);

  const { t, i18n } = useTranslation("global");

  const direction = i18n.language === "ar" ? "rtl" : "ltr";


  const [proxyEmployees, setProxyEmployees] = useState(user.proxyEmployees || []);

  const handleDeleteProxyEmployee = async (proxyEmployeeId) => {
    try {
      const db = getFirestore();

      if (!proxyEmployeeId) {
        console.error("proxyEmployeeId غير موجود!");
        return;
      }

      const proxyEmployeeDocRef = doc(db, "proxyEmployees", proxyEmployeeId);


      await deleteDoc(proxyEmployeeDocRef);
      console.log(`م حذف وثيقة الموظف البديل بنجاح من مجموعة proxyEmployees`);

      const employeeDocRef = doc(db, "employees", mainUserId);
      const employeeDocSnap = await getDoc(employeeDocRef);

      if (employeeDocSnap.exists()) {
        const employeeData = employeeDocSnap.data();
        const proxyEmployeesIds = employeeData.proxyEmployeeIds || [];

        const updatedProxyEmployeesIds = proxyEmployeesIds.filter(
          (id) => id !== proxyEmployeeId
        );

        await updateDoc(employeeDocRef, {
          proxyEmployeeIds: updatedProxyEmployeesIds,
        });

        console.log("تم تحديث قائمة الموظفين البدلاء بنجاح في مجموعة employees");

        setProxyEmployees(updatedProxyEmployeesIds);
      
          setRefresh(false);
     

      } else {
        console.log("لا يوجد مستند للموظف في مجموعة employees");
      }
    } catch (error) {
      console.error("خطأ أثناء حذف الموظف البديل:", error);
    }
  };


  const handleEdit = () => {
    navigate("/editproxy", { state: { user: { ...user, id: user.id } } });
  };
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
        <button className="text-center bg-[#CDA03D] py-2 px-9  shadow-xl m-9 rounded-full text-white flex  text-lg font-bold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300" onClick={handleBack} dir={direction} style={{marginTop:"400px"}}>
        <IoArrowBack className="mt-1 mr-3" />  {t("text.back")}
            </button></div>
      <div className=" justify-center flex items-center pb-[200px]"   dir={direction}>
        <Card className="w-[900px] h-auto "  dir={direction}>
          <div className="flex flex-col items-center pb-10"  >
          <div style={profileContainerStyle}>
            <img
              alt="User Avatar"
              src={user.profileImage || user.proxyProfileImage ||"https://www.lightsong.net/wp-content/uploads/2020/12/blank-profile-circle.png"}
              style={imageStyle}
            />
            </div>
            <div className="mt-4 w-full">
              <table className="min-w-full  border-collapse">
                <tbody className="text-gray-700">
                  <tr>
                  <td className="px-4 py-2 font-bold"> {t('userInfo.employeeName')}</td>

                    <td className="px-4 py-2">
                      {user.employeeName || user.proxyEmployeeName}
                    </td>
                
                  </tr>
                  <tr className="bg-[#fce8ca]">
                  <td className="px-4 py-2 font-bold"> {t('userInfo.employeeId')}</td>
                    <td className="px-4 py-2">
                      {user.employeeId || user.proxyEmployeeId}
                    </td>
                  </tr>
                  <tr>
                  <td className="px-4 py-2 font-bold">{t('userInfo.hireDate')}</td>

                    <td className="px-4 py-2">
                      {user.hiringDate || user.proxyHireDate}
                    </td>
                    </tr>
                  <tr className="bg-[#fce8ca]">
                   
                    <td className="px-4 py-2 font-bold">{t('userInfo.jobGrade')}</td>    <td className="px-4 py-2">
                      {user.jobGrade || user.proxyJobGrade}
                    </td>               </tr>
                  <tr>
                  <td className="px-4 py-2 font-bold">{t('userInfo.department')}</td>

                    <td className="px-4 py-2">
                      {user.department || user.proxyDepartment}
                    </td>
                  </tr>
                  <tr className="bg-[#fce8ca]">
                  <td className="px-4 py-2 font-bold">{t('userInfo.officeNumber')}</td>

                    <td className="px-4 py-2">
                      {user.officeNumber || user.proxyOfficeNumber}
                    </td>
                  </tr>
                  <tr>
                  <td className="px-4 py-2 font-bold ">{t('userInfo.jobTitle')}</td>
                    <td className="px-4 py-2">
                      {user.jobTitle || user.proxyJobTitle}
                    </td>
                 
                  </tr>
                  <tr className="bg-[#fce8ca]">
                  <td className="px-4 py-2 font-bold">{t('userInfo.phoneNumber')}</td>

                    <td className="px-4 py-2">
                      {user.phoneNumber || user.proxyPhoneNumber}
                    </td>
              
                  </tr>
                  <tr>
                  <td className="px-4 py-2 font-bold">{t('userInfo.currentOffice')}</td>
                    <td className="px-4 py-2">
                      {user.currentOffice || user.proxyCurrentOffice}
                    </td>
                  </tr>
                  <tr className="">
                  <td className="px-4 py-2 font-bold">{t('userInfo.email')}</td>

                    <td className="px-4 py-2">{user.employeeEmail||user.proxyEmail}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex gap-9">
              <Button
                onClick={handleEdit}
                className="bg-blue-600 hover:bg-blue-700"
              >
                    {t("userInfo.edituser")}
              </Button>
              <Button
                onClick={() => handleDeleteProxyEmployee(user.id)}
                className="bg-red-600 hover:bg-red-700"
              >
               {t("userInfo.delete")}
              </Button>
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
  width: '250px',
  height: '250px',
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
