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

export default function MatrixLists() {
  const { t, i18n } = useTranslation("global");

  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("");
  const [filteredMatrices, setFilteredMatrices] = useState([]);
  const [matrix, setMatrix] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]); // Category selection state

  // Define categories for filtering
  const categories = [
    "قانون",
    "النظام",
    "اللائحة التنفيذية",
    "لائحة",
    "سياسة",
    "قرارات",
    "تعليمات",
  ];

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
    let results = [...matrix];

    if (searchBy === "subjectContent" && searchQuery) {
      try {
        const subjectTitles = await searchSubjectContent(searchQuery);
        if (subjectTitles.length > 0) {
          results = results.filter((matrixItem) => {
            const matrixSubjects = matrixItem.subjects || [];
            return matrixSubjects.some((subjectTitle) =>
              subjectTitles.includes(subjectTitle)
            );
          });
          setFilteredMatrices(results);
        } else {
          setFilteredMatrices([]);
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setFilteredMatrices([]);
      }
    } else if (searchBy && searchQuery) {
      results = results.filter((matrixItem) => {
        const value = matrixItem[searchBy];

        if (Array.isArray(value)) {
          return value.some((item) =>
            item.toLowerCase().includes(searchQuery.toLowerCase())
          );
        } else if (typeof value === "string") {
          return value.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return false;
      });
    }

    setFilteredMatrices(results);
  };
  const handleSearchByChange = (e) => {
    setSearchBy(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSearchBy("");
    setSelectedCategories([]); // Clear category selection
    setFilteredMatrices(matrix); // Reset matrices to the full list
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;

    // Update selected categories based on checkbox interaction
    const updatedCategories = checked
      ? [...selectedCategories, value]
      : selectedCategories.filter((category) => category !== value);

    setSelectedCategories(updatedCategories);

    // Immediately apply filtering based on the updated category selection
    filterByCategory(updatedCategories);
  };

  const filterByCategory = (updatedCategories) => {
    let results = [...matrix];

    // Filter by selected categories
    if (updatedCategories.length > 0) {
      results = results.filter((matrixItem) => {
        // Assuming the category is a string
        if (typeof matrixItem.category === "string") {
          return updatedCategories.includes(matrixItem.category);
        }
        // If it's an array, make sure to check each item in the array
        if (Array.isArray(matrixItem.category)) {
          return matrixItem.category.some((cat) =>
            updatedCategories.includes(cat)
          );
        }
        return false; // Default case
      });
    }

    setFilteredMatrices(results); // Update the filtered matrices
  };

  return (
    <div
      className="flex flex-col"
      style={{ paddingTop: "270px", paddingBottom: "44px" }}
    >
      <div className="relative flex justify-center items-center text-center">
        <Topbanner />
      </div>

      {/* Input search section */}
      <div className="search flex xs:flex-col md:flex-row xs:items-center xs:gap-y-4 md:gap-y-0 justify-center mt-9">
        {/* Select what to search by */}
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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={!searchBy}
        />
        <button
          onClick={handleSearch}
          className="ml-2 px-4 py-2 rounded-full bg-[#CDA03D] text-white"
        >
          {t("matrix.searchButton")}
        </button>
        <button
          onClick={handleClearFilters}
          className="ml-2 px-4 py-2 rounded-full bg-[#CDA03D] text-white"
        >
          {t("matrix.clearFilters")}
        </button>
      </div>

      {/* Category filter section */}
      <div className="flex justify-center mt-4">
        {categories.map((category, index) => (
          <div key={index} className="mx-2">
            <label className="flex items-center space-x-2">
              <Checkbox
                value={category}
                checked={selectedCategories.includes(category)}
                onChange={handleCategoryChange}
              />
              <span>{category}</span>
            </label>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center m-44">
          <Loader />
        </div>
      ) : (
        <div className="flex-grow">
          <MatrixTable matrices={filteredMatrices} />
        </div>
      )}
      <div className="mt-auto">
        <Bottombanner />
      </div>
    </div>
  );
}
