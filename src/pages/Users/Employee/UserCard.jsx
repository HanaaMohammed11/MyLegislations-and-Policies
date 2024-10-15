import { Button } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function UserTable({ users }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("global");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const handleDetailsClick = (user) => {
    navigate('/userinfo', { state: { user } });
  };

  if (!users || users.length === 0) {
    return (
      <p className="text-center text-gray-500">
        {t("EmpCard.noEmp")}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto w-full mx-14  my-10 shadow-2xl">
      <table className="w-full text-center text-xl font-semibold" dir={direction}>
        <thead className="text-center text-lg bg-white">
          <tr>
            <th scope="col" className="px-6 py-3">{t("userInfo.employeeName")}</th>
     
            <th scope="col" className="px-6 py-3">{t("job.jobTitle")}</th>
            <th scope="col" className="px-6 py-3">{t("job.phoneNumber")}</th>
            <th scope="col" className="px-6 py-3">{t("EmpCard.details")}</th>
          </tr>
        </thead>
        <tbody>
  {users.map((user, index) => (
    <tr
      key={user.employeeId}
      className={`${index % 2 === 0 ? 'bg-[#DEBA9A]' : 'bg-white'} border-b dark:bg-gray-800 dark:border-gray-700`}
    >
      <td className="px-6 py-4  dark:text-white w-44">
        <div className="flex items-center">
          <div style={profileContainerStyle}>
            <img
              alt={`${user.employeeName} image`}
              src={user.profileImage || "https://www.lightsong.net/wp-content/uploads/2020/12/blank-profile-circle.png"}
              style={imageStyle}
            />
          </div>
          <span className="mr-4 truncate ml-4">{user.employeeName}</span>
        </div>
      </td>

      <td className="px-6 py-4 text-black">
        {user.jobTitle}
      </td>
      <td className="px-6 py-4">
        {user.phoneNumber}
      </td>
      <td className="px-6 py-4">
        <button onClick={() => handleDetailsClick(user)}>
          {t("EmpCard.details")}
        </button>
      </td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
}

export default UserTable;
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

// يمكنك إضافة أنماط CSS أدناه
const style = `
  @keyframes rotate-border {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
document.head.insertAdjacentHTML("beforeend", `<style>${style}</style>`);