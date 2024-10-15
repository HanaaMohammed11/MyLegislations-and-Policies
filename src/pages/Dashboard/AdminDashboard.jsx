/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import SideBar from "./SideBar";
import MatrixForm from "./Componants/Matrix/MatrixForm";
import MatrixList from "./Componants/Matrix/MatrixList";
import EditTheme from "./Componants/EditTheme";
import AdminUserCard from "./Componants/users/AdminUserCard";
import AdminUsers from "./Componants/users/AdminUsers";
import SubjectList from "./Componants/Subjects/SubjectList";
import AddAccounts from "./Componants/Addaccunts";
import Topbanner from "../Home/componants/banner/Topbanner";
import Bottombanner from "../Home/componants/banner/Bottombanner";

function AdminDashboard() {
    const { t ,i18n} = useTranslation("global");
    const direction = i18n.language === "ar" ? "rtl" : "ltr";


    return (
        <div >
            <Topbanner/>
         
        <div className=" top-0 "  style={{  paddingTop: "300px",
   }}>
          
        <SideBar/>
         
        </div>
        <div className="">
        <Bottombanner/>
        </div>
   
        </div>
    );
}

export default AdminDashboard;
