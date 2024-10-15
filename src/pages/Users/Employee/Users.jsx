import React, { useEffect, useState } from "react";
import Topbanner from "../../Home/componants/banner/Topbanner";
import Bottombanner from "../../Home/componants/banner/Bottombanner";
import { useTranslation } from "react-i18next";
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import db from "../../../config/firebase";
import Loader from "../../Login/loader"; 
import { useNavigate } from "react-router-dom";
import UserTable from "./UserCard";

export default function Users() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [user, setUser] = useState([]);
  
  const { t, i18n } = useTranslation("global");
  const [loading, setLoading] = useState(true);
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  // Fetch current user data
  useEffect(() => {
    const qUser = query(
      collection(db, "users"),
      where("ID", "==", localStorage.getItem("id"))
    );
    const unsubscribe = onSnapshot(qUser, (snapshot) => {
      const userData = [];
      snapshot.forEach((doc) => {
        userData.push({ docId: doc.id, ...doc.data() });
      });
      setUser(userData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch employees based on the current user's ownerAdmin
  useEffect(() => {
    const getSubjects = async () => {
      if (user.length > 0) {
        setLoading(true);
        const ownerAdminId = user[0].ownerAdmin || user[0].ID;
        const querySnapshot = await getDocs(
          query(
            collection(db, "employees"),
            where("ownerAdmin", "==", ownerAdminId)
          )
        );
        const subjectsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsersData(subjectsList);
        setLoading(false);
      }
    };

    getSubjects();
  }, [user]);

  const filteredUsers = usersData.filter((user) =>
    user.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col  " style={{  paddingTop: "270px",
      paddingBottom: "440px"}}>
      <div className="relative flex justify-center items-center text-center">
        <Topbanner />
      </div>

      {/* Search bar */}
      <div className="search flex justify-center mt-9">
        <input
          type="text"
          placeholder={t("search.searchEmployees")}
          className="xs:w-72 sm:w-96 rounded-full"
          dir={direction}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* User Cards section */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <Loader />
        </div>
      ) : (
        <div className="flex flex-wrap justify-center">
          {filteredUsers.length > 0 ? (
            <UserTable users={filteredUsers} />
          ) : (
            <p className="text-center text-gray-500 m-44">
              {t("EmpCard.noEmp")}
            </p>
          )}
        </div>
      )}

      <div className="mt-auto">
        <Bottombanner />
      </div>
    </div>
  );
}
