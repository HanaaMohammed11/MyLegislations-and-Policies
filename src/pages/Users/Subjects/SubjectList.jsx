import React, { useState } from 'react';
import Topbanner from '../../Home/componants/banner/Topbanner';
import Bottombanner from '../../Home/componants/banner/Bottombanner';
import SubTable  from './SubCard';
import { useTranslation } from 'react-i18next';

export default function SubjectsLists() {
  const { t, i18n } = useTranslation("global");

  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [searchTerm, setSearchTerm] = useState(''); 

  return (
    <div className='flex flex-col  '  style={{  paddingTop: "270px",
      paddingBottom: "44px"}}>
      <div className="relative flex justify-center items-center text-center">
        <Topbanner />
      </div>

      <div className='search flex justify-center mt-9'>
        <input
          type="text"
          placeholder={t('articels.searchPlaceholder')} 
          className="xs:w-72 sm:w-96 rounded-full"
          dir={direction}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      <div className='flex-grow'>
        <SubTable searchTerm={searchTerm} /> 
      </div>

      <div className='mt-auto'>
        <Bottombanner />
      </div>
    </div>
  );
}
