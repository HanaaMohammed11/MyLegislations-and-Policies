import React, { useState } from "react";
import Topbanner from "./../Home/componants/banner/Topbanner";
import Bottombanner from "./../Home/componants/banner/Bottombanner";
import Cards from "./Card";
import MatrixLists from "../Users/Matrixs/MatrixLists";
import { useTranslation } from "react-i18next";
import SubjectsLists from "../Users/Subjects/SubjectList";
import AdminDashboard from "../Dashboard/AdminDashboard";
import Users from "../Users/Employee/Users";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Home() {
  const { t, i18n } = useTranslation("global");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [selectedContent, setSelectedContent] = useState("matrices");
  const isRTL = i18n.language === "ar";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <div className="relative flex flex-col sm:flex-row min-h-screen bg-[#F5F5F5] w-full" dir={direction}>
      <div className="sm:hidden absolute p-4 z-50">
        <button onClick={toggleSidebar}>
          {isSidebarOpen ? (
            <FaTimes size={24} className="text-red-700" />
          ) : (
            <FaBars size={24} className="text-gray-700" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "block" : "hidden"
        } sm:block h-full flex-shrink-0 fixed top-0 w-64 z-50 shadow-lg`}
      >
        <Cards setSelectedContent={setSelectedContent} />
      </div>

      {/* Main Content Area */}
      <div className={`w-full flex flex-col ${isRTL ? "sm:mr-64" : "sm:ml-64"}`}>
        <div className="">
          <Topbanner />
        </div>

        {/* Main content */}
        <div className="flex-grow p-4">{renderContent()}</div>

        <div className="mt-auto ">
          <Bottombanner  />
        </div>
      </div>
    </div>
  );
}
