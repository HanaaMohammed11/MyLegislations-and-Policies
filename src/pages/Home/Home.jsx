import React, { useState } from "react";
import Topbanner from "./../Home/componants/banner/Topbanner";
import Bottombanner from "./../Home/componants/banner/Bottombanner";
import Cards from "./Card";
import MatrixLists from "../Users/Matrixs/MatrixLists";
import { useTranslation } from "react-i18next";
import SubjectsLists from "../Users/Subjects/SubjectList";
import AdminDashboard from "../Dashboard/AdminDashboard";
import { HiMenu, HiX } from "react-icons/hi";

export default function Home() {
  const { t, i18n } = useTranslation("global");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [selectedContent, setSelectedContent] = useState("matrices");
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
    <div className="flex min-h-screen  w-full" dir={direction}>
      {/* Sidebar Toggle Button for Mobile */}
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
        className={`fixed top-0 ${direction === "rtl" ? "right-0" : "left-0"} h-full w-64 z-[1500] shadow-lg bg-white transition-transform transform 
          ${isSidebarOpen ? "translate-x-0" : direction === "rtl" ? "translate-x-full" : "-translate-x-full"} sm:translate-x-0`}
      >
        <Cards setSelectedContent={setSelectedContent} toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Content Area */}
      <div className={`flex-grow  ${direction === "rtl" ? "lg:mr-64" : "lg:ml-64"} `}>
        <Topbanner />
        <div className="flex-grow ">{renderContent()}</div>
        <Bottombanner />
      </div>
    </div>
  );
}
