import React, { useState } from "react";
import Topbanner from "./../Home/componants/banner/Topbanner";
import Bottombanner from "./../Home/componants/banner/Bottombanner";
import Cards from "./Card";
import MatrixLists from "../Users/Matrixs/MatrixLists";
import { useTranslation } from "react-i18next";
import SubjectsLists from "../Users/Subjects/SubjectList";
import AdminDashboard from "../Dashboard/AdminDashboard";
import Users from "../Users/Employee/Users";
import { HiMenu, HiX } from "react-icons/hi";

export default function Home() {
  const { t, i18n } = useTranslation("global");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [selectedContent, setSelectedContent] = useState("matrices");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isRTL = i18n.language === "ar";

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const renderContent = () => {
    switch (selectedContent) {
    
      case "articles":
        return <SubjectsLists />;
      case "matrices":
        return <MatrixLists />;
      case "dashboard":
        return <AdminDashboard />;
      default:
        return <div className="p-4">{t("Select a category from the sidebar")}</div>;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-[#F5F5F5] w-full" dir={direction}>
      {/* زر القائمة الجانبية للأحجام الصغيرة */}
      <div className="sm:hidden absolute top-4 left-4 z-[1700]">
        <button onClick={toggleSidebar}>
          {isSidebarOpen ? (
            <HiX size={24} className="text-red-700 " />
          ) : (
            <HiMenu size={24} className="text-gray-700" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`h-full flex-shrink-0 fixed top-0 w-64 z-[1500] shadow-lg transition-transform duration-300 ease-in-out bg-white
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0 sm:relative`}
      >
        <Cards setSelectedContent={setSelectedContent} toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Content Area */}
      <div
        className={`w-full flex flex-col 
 
       transition-all duration-300 ease-in-out`}
      >
        <Topbanner />
        <div className="flex-grow p-4">{renderContent()}</div>
        <Bottombanner />
      </div>
    </div>
  );
}
