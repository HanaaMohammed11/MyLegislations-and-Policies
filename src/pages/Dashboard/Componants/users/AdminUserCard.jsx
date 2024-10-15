import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AiFillEye } from "react-icons/ai";

export default function AdminUserCard({ user, index }) {
  const navigate = useNavigate();
  const { t } = useTranslation("global");

  const handleCardClick = () => {
    navigate(`/AdminUserInfo`, { state: { user } });
  };

  // Set alternating row colors
  const rowColor = index % 2 === 0 ? 'bg-[#DEBA9A]' : 'bg-white';

  return (
    <tr className={`${rowColor} cursor-pointer  font-semibold`} onClick={handleCardClick}>
      <td className="px-6 py-4 w-44">
        <div className="flex items-center">
          <div style={profileContainerStyle}>
            <img
              alt={`${user.employeeName} image`}
              src={user.profileImage || "https://www.lightsong.net/wp-content/uploads/2020/12/blank-profile-circle.png"}
              style={imageStyle}
            />
          </div>
          <span className="mr-4 truncate font-semibold text-xl ml-4">{user.employeeName}</span>
        </div>
      </td>

      <td className="px-6 font-semibold py-4 text-xl">{user.jobTitle}</td>
      <td className="px-6 font-semibold py-4 text-xl">{user.phoneNumber}</td>
      <td className="px-6 font-semibold py-4">
        <button className="text-blue-500">       <AiFillEye size={20} /></button>
      </td>
    </tr>
  );
}
const profileContainerStyle = {

  width: '50px',
  height: '50px',
  position: 'relative',
  borderRadius: '50%',
  border: '6px solid transparent', 
  background: 'linear-gradient(white, white) padding-box, linear-gradient(45deg, #000000 40%, #404040 60%, #C0C0C0 100%) border-box',

};

// أنماط الصورة
const imageStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '50%', 
  display: 'block',
};