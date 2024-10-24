import React, { useEffect, useState } from 'react';
import db from '../../../../config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function Bottombanner() {
  const [BottomBannerUrl, setBottomBannerUrl] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'banners', 'bottomBanner'), (doc) => {
      if (doc.exists()) {
        setBottomBannerUrl(doc.data().imageUrl);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div
    className="BottomBanner w-full z-[1000]  h-36 rounded-xl bg-cover bg-center fixed bottom-0"
    style={{
      backgroundImage: `url(${BottomBannerUrl})`,
    }}
  />
  
  );
}
