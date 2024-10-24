import React, { useState } from "react";
import { FaTh, FaBook, FaUsers } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { FiMenu } from "react-icons/fi";
import { FaUserPlus } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import "./SideBar.css";
import AdminUsers from "./Componants/users/AdminUsers";
import SubjectList from "./Componants/Subjects/SubjectList";
import EditTheme from "./Componants/EditTheme";
import AddAccounts from "./Componants/Addaccunts";
import MatrixList from "./Componants/Matrix/MatrixList";
import AdminMatrixInfo from "./Componants/Matrix/MatrixInfo";
import AdminSubjectInfo from "./Componants/Subjects/AdminSubInfo";
import AdminUserInfo from "./Componants/users/userInfo";

function SideBar() {
  const { t, i18n } = useTranslation("global");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const isRtl = i18n.language === "ar";

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const handleItemClick = (content) => {
    setSelectedItem(content);
    setIsOpen(false)
  };

  const items = [
    {
      name: t("sidebar.Legislations"),
      icon: <FaTh className="text-[#f5bc42]" />,
      content: (
        // <MatrixList handleClickShow={(item) => handleItemClick(<AdminMatrixInfo item={item}/>)} />
                <MatrixList />
      ),
    },
    {
      name: t("sidebar.Policies"),
      icon: <FaBook className="text-[#f5bc42]" />,
      content: (
        // <SubjectList handleClickShow={(item) => handleItemClick(<AdminSubjectInfo item={item}/>)} />
        <SubjectList/>

      ),
    },
  
    {
      name: t("sidebar.editAppearance"),
      icon: <IoSettingsSharp className="text-[#f5bc42]" />,
      content: <EditTheme />,
    },
    {
      name: t("sidebar.addUser"),
      icon: <FaUserPlus className="text-[#f5bc42]" />,
      content: <AddAccounts />,
    },
    // { name: t("sidebar.info"), icon: <FaUserPlus className="text-[#f5bc42]" />, content:<AdminMatrixInfo /> },
  ];

  return (
    <>
      <button
        className={`lg:hidden z-50 bg-[#f5bc42] p-2 rounded-md text-white `}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <FiMenu size={24} />
      </button>

      {isOpen && (
        <div className={`lg:hidden  bg-[#969594]   `}>
          {items.map(({ name, icon, content }) => {
            return (
              <button
                key={name}
                onClick={() => handleItemClick(content)}
                className="flex items-center justify-start text-lg font-bold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300 p-2 rounded"
                aria-label={`Navigate to ${name}`}
              >
                <span className="flex items-center space-x-4">
                  <span className="whitespace-nowrap">{name}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div
        className={`Sidebar   text-white fixed transform transition-transform duration-300 ${
          isOpen
            ? "translate-x-0"
            : isRtl
            ? "-translate-x-full"
            : "translate-x-full"
        } lg:translate-x-0 lg:block md:hidden hidden z-50`}
      >
        <div className=" flex gap-4 text-center   z-50" >
          {items.map(({ name, icon, content }) => (
            <button
              key={name}
              onClick={() => handleItemClick(content)}
              className={`btn-button text-center btn-curve btn-gold flex  text-lg font-semibold    hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300`}
              aria-label={`Navigate to ${name}`}
            >
              <span className="flex items-center btn-text text-center">
        
                <span className="whitespace-nowrap text-center">{name}</span>
             
              </span>
           
            </button>
          ))}
        </div>
      </div>

      <div className="content-area">
        {selectedItem ? selectedItem : <MatrixList />}
      </div>
    </>
  );
}

export default SideBar;
