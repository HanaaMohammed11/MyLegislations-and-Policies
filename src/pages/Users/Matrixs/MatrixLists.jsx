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

export default function MatrixLists() {
  const { t, i18n } = useTranslation("global");

  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("");
  const [filteredMatrices, setFilteredMatrices] = useState([]);
  const [matrix, setMatrix] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

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
      // Fetch all subjects
      const subjectQuery = query(collection(db, "subjects"));
      const subjectSnapshot = await getDocs(subjectQuery);

      const subjectTitles = [];
      const lowerCaseSearchQuery = searchQuery.toLowerCase();

      subjectSnapshot.forEach((doc) => {
        const subjectData = doc.data();
        // Compare subjectContent in a case-insensitive manner
        if (
          subjectData.subjectContent
            .toLowerCase()
            .includes(lowerCaseSearchQuery)
        ) {
          subjectTitles.push(subjectData.subjectTitle);
        }
      });

      console.log("Subjects fetched:", subjectTitles); // Log the fetched subjects
      return subjectTitles;
    } catch (error) {
      console.error("Error fetching subjects:", error);
      return [];
    }
  };

  const handleSearch = async () => {
    if (searchBy === "MainEmployees" && searchQuery) {
      const matchedEmployees = employees.filter((emp) =>
        emp.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (matchedEmployees.length > 0) {
        const results = matrix.filter((matrixItem) => {
          const mainEmployees = matrixItem.MainEmployees || [];
          return (
            Array.isArray(mainEmployees) &&
            matchedEmployees.some((emp) =>
              mainEmployees.includes(emp.employeeId)
            )
          );
        });

        setFilteredMatrices(results);
      } else {
        setFilteredMatrices([]);
      }
    } else if (searchBy === "jobTitle" && searchQuery) {
      const matchedEmployeesByJobTitle = employees.filter((emp) =>
        emp.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (matchedEmployeesByJobTitle.length > 0) {
        const results = matrix.filter((matrixItem) => {
          const mainEmployees = matrixItem.MainEmployees || [];
          return (
            Array.isArray(mainEmployees) &&
            matchedEmployeesByJobTitle.some((emp) =>
              mainEmployees.includes(emp.employeeId)
            )
          );
        });

        setFilteredMatrices(results);
      } else {
        setFilteredMatrices([]);
      }
    } else if (searchBy === "subjectContent" && searchQuery) {
      try {
        const subjectTitles = await searchSubjectContent(searchQuery); // Get matching subjectTitles

        if (subjectTitles.length > 0) {
          console.log(`Matching subjectTitles: ${subjectTitles}`);

          const results = matrix.filter((matrixItem) => {
            const matrixSubjects = matrixItem.subjects || []; // Ensure subjects field exists
            console.log(`Matrix item subjects: ${matrixSubjects}`);

            // Check if any of the matrix subjects match the fetched subject titles
            return matrixSubjects.some((subjectTitle) =>
              subjectTitles.includes(subjectTitle)
            );
          });

          console.log("Filtered matrices:", results); // Add this to check the filtered matrices
          setFilteredMatrices(results);
        } else {
          setFilteredMatrices([]); // No matches found
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setFilteredMatrices([]); // Handle error by clearing results
      }
    } else if (searchBy && searchQuery) {
      const results = matrix.filter((matrixItem) => {
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

      setFilteredMatrices(results);
    }
  };

  const handleSearchByChange = (e) => {
    setSearchBy(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSearchBy("");
    setFilteredMatrices(matrix);
  };

  return (
    <div
      className="flex flex-col  "
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
            {t("matrix.selectSearchCriterion")}
          </option>
          <option value="title">{t("matrix.searchByMatrix")}</option>
          <option value="companyName">{t("matrix.searchByCompany")}</option>
          <option value="subjects">{t("matrix.searchBySubjects")}</option>
          <option value="MainEmployees">{t("matrix.searchByEmployee")}</option>
          <option value="jobTitle">{t("matrix.searchByJobTitle")}</option>
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

      {loading ? (
        <div className="flex justify-center items-center  m-44">
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
