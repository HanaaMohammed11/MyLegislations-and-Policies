/* eslint-disable no-unused-vars */
import React from "react";
import Topbanner from "./componants/banner/Topbanner";
import Bottombanner from "./componants/banner/Bottombanner";
import Cards from "./Card";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation("global");
  return (
    <div
      className="relative flex flex-col h-screen "
      style={{
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex justify-center items-center text-center  inset-0   ">
        <Topbanner />
       
      </div>

<div className=" " style={{  paddingTop: "250px",/* Adjust according to the height of Topbanner */
paddingBottom: "200px"}} >


<Cards />

</div>
     

      <div className='mt-auto'>
        <Bottombanner />
      </div>
    </div>
  );
}
