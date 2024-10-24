/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import MatrixTable from "./MatrixCard";
import Topbanner from "../../Home/componants/banner/Topbanner";
import Bottombanner from "../../Home/componants/banner/Bottombanner";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import db from "../../../config/firebase";
import { useTranslation } from "react-i18next";
import Loader from "../../Login/loader";
import { Checkbox } from "flowbite-react"; // Import Flowbite Checkbox
import { CiSearch } from "react-icons/ci";
import MatrixInfo from "./MatrixInfo";
import SubjectInfo from "../Subjects/SubjectInfo";

export default function MatrixLists() {
  const { t, i18n } = useTranslation("global");

  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const [searchQuery, setSearchQuery] = useState("");
  const [tempSearchQuery, setTempSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("");
  const [filteredMatrices, setFilteredMatrices] = useState([]);
  const [matrix, setMatrix] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]); // Category selection state
  const [user, setUser] = useState("");
  const [selectedMatrix, setselectedMatrix] = useState(null);
  const [selectedSubject, setselectedSubject] = useState(null);
  const handleMatrixctClick = (Matrix) => {
    setselectedSubject(null);
    setselectedMatrix(Matrix);
  };
  const handleSubjectClick = (subject) => {
    setselectedMatrix(null);
    setselectedSubject(subject);

  };

  useEffect(() => {
    const fetchUserAndBanner = async () => {
      try {
        const q = query(
          collection(db, "users"),
          where("ID", "==", localStorage.getItem("id"))
        );
        const querySnapshot = await getDocs(q);
        const userData = querySnapshot.docs.map((doc) => doc.data());

        if (userData.length > 0) {
          setUser(userData[0]);
        }
      } catch (error) {
        console.error("Error fetching user or banner data: ", error);
      }
    };

    fetchUserAndBanner();
  }, []);

  const categories = {
    قانون: t("select.law"), 
    نظام: t("select.system"),
    "لائحة تنفيذية": t("select.executiveRegulations"),
    تعليمات: t("select.instructions"),


  };

  useEffect(() => {
    const qmatrix = query(
      collection(db, "legislations"),
      where("intro", "!=", 0)
    );

    const unsubscribe = onSnapshot(qmatrix, (snapshot) => {
      const matrixData = [];
      snapshot.forEach((doc) => {
        matrixData.push({ id: doc.id, ...doc.data() });
      });
      setMatrix(matrixData);
      setFilteredMatrices(matrixData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const searchSubjectContent = async (searchQuery) => {
    try {
      const subjectQuery = query(collection(db, "subjects"));
      const subjectSnapshot = await getDocs(subjectQuery);

      const subjectTitles = [];
      const lowerCaseSearchQuery = searchQuery.toLowerCase();

      subjectSnapshot.forEach((doc) => {
        const subjectData = doc.data();
        if (
          subjectData.subjectContent
            .toLowerCase()
            .includes(lowerCaseSearchQuery)
        ) {
          subjectTitles.push(subjectData.subjectTitle);
        }
      });

      console.log("Subjects fetched:", subjectTitles);
      return subjectTitles;
    } catch (error) {
      console.error("Error fetching subjects:", error);
      return [];
    }
  };

  const handleSearch = async () => {
    let results = [];

    // Force category selection before searching
    if (selectedCategories.length === 0) {
      setFilteredMatrices([]); // Return an empty result if no categories are selected
      return;
    }

    // Filter by selected categories
    results = [...matrix].filter((matrixItem) => {
      if (typeof matrixItem.category === "string") {
        return selectedCategories.includes(matrixItem.category);
      }
      if (Array.isArray(matrixItem.category)) {
        return matrixItem.category.some((cat) =>
          selectedCategories.includes(cat)
        );
      }
      return false;
    });

    // Apply search query if present
    if (tempSearchQuery) {
      if (searchBy === "subjectContent") {
        try {
          const subjectTitles = await searchSubjectContent(tempSearchQuery);
          if (subjectTitles.length > 0) {
            results = results.filter((matrixItem) => {
              const matrixSubjects = matrixItem.subjects || [];
              return matrixSubjects.some((subjectTitle) =>
                subjectTitles.includes(subjectTitle)
              );
            });
          } else {
            results = [];
          }
        } catch (error) {
          console.error("Error fetching subjects:", error);
          results = [];
        }
      } else if (searchBy) {
        results = results.filter((matrixItem) => {
          const value = matrixItem[searchBy];
          if (Array.isArray(value)) {
            return value.some((item) =>
              item.toLowerCase().includes(tempSearchQuery.toLowerCase())
            );
          } else if (typeof value === "string") {
            return value.toLowerCase().includes(tempSearchQuery.toLowerCase());
          }
          return false;
        });
      }
    }

    setFilteredMatrices(results);
  };

  const handleSearchByChange = (e) => {
    setSearchBy(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setTempSearchQuery("");
    setSearchBy("");
    setSelectedCategories([]);
    setFilteredMatrices(matrix);
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;

    const updatedCategories = checked
      ? [...selectedCategories, value]
      : selectedCategories.filter((category) => category !== value);

    setSelectedCategories(updatedCategories);

    filterByCategory(updatedCategories);
  };

  const filterByCategory = (updatedCategories) => {
    let results = [...matrix];

    if (updatedCategories.length > 0) {
      results = results.filter((matrixItem) => {
        if (typeof matrixItem.category === "string") {
          return updatedCategories.includes(matrixItem.category);
        }
        if (Array.isArray(matrixItem.category)) {
          return matrixItem.category.some((cat) =>
            updatedCategories.includes(cat)
          );
        }
        return false;
      });
    }

    setFilteredMatrices(results);
  };
  return (
    <div
      className="flex flex-col"
      style={{ paddingTop: "120px", paddingBottom: "44px" }}
    >
      <div className="relative flex justify-center items-center text-center">
   
      </div>

      {/* Input search section */}
      <div className="search flex-col flex xs:flex-col md:flex-row xs:items-center xs:gap-y-4 md:gap-y-0 justify-center mt-9">
        <select
          value={searchBy}
          onChange={handleSearchByChange}
          className="w-40 p-2 rounded-md text-gray-700"
        >
          <option value="" disabled>
            {t("matrix.selectSearchCriterion")}
          </option>
          <option value="title">{t("matrix.searchByMatrix")}</option>
          <option value="companyName">{t("matrix.searchByCompany")}</option>
          <option value="subjects">{t("matrix.searchBySubjects")}</option>
          <option value="subjectContent">
            {t("matrix.searchBySubjectContent")}
          </option>
        </select>

        <input
          type="text"
          placeholder={t("matrix.searchButton")}
          className="xs:w-72 sm:w-96 rounded-full ml-4"
          dir={direction}
          value={tempSearchQuery}
          onChange={(e) => setTempSearchQuery(e.target.value)}
          disabled={!searchBy}
        />
        <button
          onClick={() => {
            setSearchQuery(tempSearchQuery);
            handleSearch();
          }}
             className="  ml-2 mr-2  px-4 py-2 rounded-full bg-[#CDA03D] text-white"

        >
          {t("matrix.searchButton")}
        </button>
        <button
          onClick={handleClearFilters}
          className="  ml-2 mr-2  px-4 py-2 rounded-full bg-[#CDA03D] text-white"
        >
          {t("matrix.clearFilters")}
        </button>
      </div>

      {/* Category filter section */}
      <div className="flex justify-center mt-4">
      {Object.entries(categories).map(([key, value]) => (
        <div key={key} className="mx-2">
          <label className="flex items-center space-x-2" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
            <Checkbox
              className="ml-2"
              value={key} 
              checked={selectedCategories.includes(key)}
              onChange={handleCategoryChange}
            />
            <span>{value}</span>
          </label>
        </div>
      ))}
      </div>

      {loading ? (
  <div className="flex justify-center items-center my-44">
    <Loader />
  </div>
) : selectedMatrix ? (
  <MatrixInfo
    matrix={selectedMatrix}
    onSubjectClick={handleSubjectClick}
    onBack={() => setselectedMatrix(null)}
  />
) : selectedSubject ? (
  <SubjectInfo
    subject={selectedSubject}

    onMatrixClick={handleMatrixctClick}
    onBack={() => setselectedSubject(null)}
  />
) :
 ( // Default case
  <MatrixTable
    matrices={filteredMatrices}
    onMatrixClick={handleMatrixctClick}
  />
)}

    </div>
  );
}
