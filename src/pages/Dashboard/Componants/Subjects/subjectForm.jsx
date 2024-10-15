/* eslint-disable no-unused-vars */
// /* eslint-disable no-unused-vars */
// import React, { useEffect, useState } from "react";
// import { Button, Label, Textarea, TextInput, Select } from "flowbite-react";
// import { useNavigate } from "react-router-dom";
// import db from "../../../../config/firebase";
// import { addDoc, collection, onSnapshot } from "firebase/firestore";

// export default function SubjectForm() {
//   const navigate = useNavigate();
//   const [subjectNum, setSubjectNum] = useState("");
//   const [subjectField, setSubjectField] = useState("");
//   const [subjectTitle, setSubjectTitle] = useState("");
//   const [subjectContent, setSubjectContent] = useState("");
//   const [relatedMatrix, setRelatedMatrix] = useState("");
//   const [emp1, setEmp1] = useState("");
//   const [emp2, setEmp2] = useState("");
//   const [notes, setNotes] = useState("");
//   const [matrix, setMatrix] = useState([]);
//   const [employees, setEmployees] = useState([]);

//   const handleSave = async () => {
//     const data = {
//       subjectNum,
//       subjectField,
//       subjectTitle,
//       subjectContent,
//       relatedMatrix,
//       emp1,
//       emp2,
//       notes,
//     };

//     try {
//       await addDoc(collection(db, "subjects"), data); // Assuming 'subjects' is your collection name
//       alert("تم حفظ البيانات بنجاح");
//       navigate("/home");
//     } catch (error) {
//       console.error("Error adding document: ", error);
//     }
//   };

//   useEffect(() => {
//     const usersCollectionRef = collection(db, "matrix");

//     const unsubscribe = onSnapshot(usersCollectionRef, (snapshot) => {
//       const Matrixs = [];
//       snapshot.forEach((doc) => {
//         Matrixs.push({ id: doc.id, ...doc.data() });
//       });
//       setMatrix(Matrixs);
//       // setFilteredMatrix(Matrixs);
//     });

//     return () => unsubscribe();
//   }, []);
//   useEffect(() => {
//     const usersCollectionRef = collection(db, "employees");

//     const unsubscribe = onSnapshot(usersCollectionRef, (snapshot) => {
//       const epmloyees = [];
//       snapshot.forEach((doc) => {
//         epmloyees.push({ id: doc.id, ...doc.data() });
//       });
//       setEmployees(epmloyees);
//       // setFilteredMatrix(Matrixs);
//     });

//     return () => unsubscribe();
//   }, []);
//   return (
//     <div className="flex" >
//       <div className="ml-64 p-8 w-full max-w-5xl">
//         <h1
//           className="text-right text-3xl font-semibold text-gray-800 bg-[#B5B5B6] p-5 rounded-t-xl"
//
//         >
//           إضافة مادة جديدة
//         </h1>

//         {/* Form Section */}
//         <div className="bg-white p-8 rounded-lg shadow-md">
//           <div className="text-right grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Subject Field */}
//             <div className="xs:col-span-2 md:col-span-1">
//               <Label
//                 htmlFor="subjectField"
//                 value="الحقل"
//                 className="text-xl font-semibold"
//               />
//               <TextInput
//                 id="subjectField"
//                 type="text"
//                 sizing="sm"
//                 className="mt-2"
//                 value={subjectField}
//                 onChange={(e) => setSubjectField(e.target.value)}
//               />
//             </div>

//             {/* Subject Number */}
//             <div className="xs:col-span-2 md:col-span-1">
//               <Label
//                 htmlFor="subjectNum"
//                 value="رقم المادة"
//                 className="text-xl font-semibold"
//               />
//               <TextInput
//                 id="subjectNum"
//                 type="text"
//                 sizing="sm"
//                 className="mt-2"
//                 value={subjectNum}
//                 onChange={(e) => setSubjectNum(e.target.value)}
//               />
//             </div>

//             {/* Subject Title */}
//             <div className="col-span-2">
//               <Label
//                 htmlFor="subjectTitle"
//                 value="موضوع المادة"
//                 className="text-xl font-semibold"
//               />
//               <TextInput
//                 id="subjectTitle"
//                 type="text"
//                 sizing="lg"
//                 className="mt-2"
//                 value={subjectTitle}
//                 onChange={(e) => setSubjectTitle(e.target.value)}
//               />
//             </div>

//             {/* Subject Content */}
//             <div className="col-span-2">
//               <Label
//                 htmlFor="subjectContent"
//                 value="نص المادة"
//                 className="text-xl font-semibold"
//               />
//               <Textarea
//                 id="subjectContent"
//                 required
//                 rows={4}
//                 className="mt-2"
//                 value={subjectContent}
//                 onChange={(e) => setSubjectContent(e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="text-right grid grid-cols-1 gap-6">
//             {/* Related Matrix */}
//             <div className="col-span-2 pt-8">
//               <Label
//                 htmlFor="relatedMatrix"
//                 value="المصفوفة التابعة لها"
//                 className="text-xl font-semibold"
//               />
//               <Select
//                 id="relatedMatrix"
//                 className="mt-2"
//                 value={relatedMatrix}
//                 onChange={(e) => setRelatedMatrix(e.target.value)}
//               >
//                 {/* <option value="matrix1">المصفوفة 1</option>
//                 <option value="matrix2">المصفوفة 2</option>
//                 <option value="matrix3">المصفوفة 3</option> */}
//                 {matrix.map((item, index) => (
//                   <option key={index} value={item.title}>
//                     {item.title}
//                   </option>
//                 ))}
//               </Select>
//             </div>

//             {/* Assigned Employee */}
//             <div className="col-span-2 pt-8">
//               <Label
//                 htmlFor="emp1"
//                 value="الموظف التابع لها"
//                 className="text-xl font-semibold"
//               />
//               <Select
//                 id="emp1"
//                 className="mt-2"
//                 value={emp1}
//                 onChange={(e) => setEmp1(e.target.value)}
//               >
//                 {/* <option value="employee1">الموظف 1</option>
//                 <option value="employee2">الموظف 2</option>
//                 <option value="employee3">الموظف 3</option> */}
//                 {employees.map((item, index) => (
//                   <option key={index} value={item.employeeId}>
//                     {item.employeeName}
//                   </option>
//                 ))}
//               </Select>
//             </div>

//             {/* Delegate Employee */}
//             <div className="col-span-2 pt-8">
//               <Label
//                 htmlFor="emp2"
//                 value="الموظف المشترك معه"
//                 className="text-xl font-semibold"
//               />
//               <Select
//                 id="emp2"
//                 className="mt-2"
//                 value={emp2}
//                 onChange={(e) => setEmp2(e.target.value)}
//               >
//                 {/* <option value="employee1">الموظف 1</option>
//                 <option value="employee2">الموظف 2</option>
//                 <option value="employee3">الموظف 3</option> */}
//                 {employees.map((item, index) => (
//                   <option key={index} value={item.employeeId}>
//                     {item.employeeName}
//                   </option>
//                 ))}
//               </Select>
//             </div>

//             {/* Notes */}
//             <div className="col-span-2 pt-8">
//               <Label
//                 htmlFor="notes"
//                 value="ملاحظات"
//                 className="text-xl font-semibold"
//               />
//               <Textarea
//                 id="notes"
//                 required
//                 rows={4}
//                 className="mt-2"
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Save Button */}
//         <div className="mt-8 text-right justify-center flex">
//           <Button
//             type="submit"
//             className="bg-[#6B7280] hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition duration-500 transform hover:scale-105 w-32"
//             onClick={handleSave}
//           >
//             حفظ
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { Button, Label, Textarea, TextInput, Select } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import db from "../../../../config/firebase";
import "../../../Home/Card.css";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useTranslation } from "react-i18next";
import save from "../../../../../src/assets/save.png";
export default function SubjectForm({ onClose }) {
  const navigate = useNavigate();
  const [subjectNum, setSubjectNum] = useState("");
  const [subjectField, setSubjectField] = useState("");
  const [subjectTitle, setSubjectTitle] = useState("");
  const [subjectContent, setSubjectContent] = useState("");
  const [relatedMatrix, setRelatedMatrix] = useState({});
  const [emp1, setEmp1] = useState("");
  const [notes, setNotes] = useState("");
  const [matrix, setMatrix] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [sharedEmployees, setSharedEmployees] = useState([
    { empId: "", role: "" },
  ]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const [negotiationLimit, setNegotiationLimit] = useState("");
  const { t, i18n } = useTranslation("global");

  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const handleSave = async () => {
    const data = {
      ownerAdmin: localStorage.getItem("id"),
      subjectNum,
      subjectField,
      subjectTitle,
      subjectContent,
      relatedMatrix,
      emp1,
      sharedEmployees,
      notes,
      negotiationLimit,
    };

    try {
      const subjectRef = await addDoc(collection(db, "subjects"), data);
      setIsPopupVisible(true);
      onClose();
      const matrixDocRef = doc(db, "matrix", relatedMatrix.id);
  
      const matrixDocSnapshot = await getDoc(matrixDocRef);
      if (matrixDocSnapshot.exists()) {
        await updateDoc(matrixDocRef, {
          subjects: arrayUnion(data.subjectTitle),
          MainEmployees: arrayUnion(emp1.employeeId),
        });

        // navigate("/dashboard");
      } else {
        alert("The specified matrix does not exist.");
      }
    } catch (error) {
      console.error("Error adding or updating document: ", error);
    }
  };

  const handleAddSharedEmployee = () => {
    setSharedEmployees([...sharedEmployees, { empId: "", role: "" }]);
  };

  const handleSharedEmployeeChange = (index, field, value) => {
    const updatedEmployees = sharedEmployees.map((employee, i) =>
      i === index ? { ...employee, [field]: value } : employee
    );
    setSharedEmployees(updatedEmployees);
  };

  useEffect(() => {
    // const usersCollectionRef = collection(db, "matrix");
    const qMatrix = query(
      collection(db, "matrix"),
      where("ownerAdmin", "==", localStorage.getItem("id"))
    );
    const unsubscribe = onSnapshot(qMatrix, (snapshot) => {
      const Matrixs = [];
      snapshot.forEach((doc) => {
        Matrixs.push({ id: doc.id, ...doc.data() });
      });
      setMatrix(Matrixs);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // const usersCollectionRef = collection(db, "employees");
    const qEmps = query(
      collection(db, "employees"),
      where("ownerAdmin", "==", localStorage.getItem("id"))
    );
    const unsubscribe = onSnapshot(qEmps, (snapshot) => {
      const epmloyees = [];
      snapshot.forEach((doc) => {
        epmloyees.push({ id: doc.id, ...doc.data() });
      });
      setEmployees(epmloyees);
    });

    return () => unsubscribe();
  }, []);
  useEffect(() => {
    console.log("Updated relatedMatrix:", relatedMatrix);
  }, [relatedMatrix]);

  return (
    <div className="flex lg:w-[900px] md:w-[500px]  lg:mt-10 md:mt-10 mt-44 sm:mt-44   mb-16">
      <div className="mx-auto xs:py-8 xs:px-0 sm:p-8 w-full max-w-5xl">
        <h1
          dir={direction}
          className=" text-3xl font-semibold text-white bg-[#CDA03D] p-5 rounded-t-xl"
        >
          {t("subjectEditForm.addSubject")}
        </h1>

        {/* Form Section */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div
            className=" grid grid-cols-1 md:grid-cols-2 gap-6"
            dir={direction}
          >
            {/* Subject Field */}
            <div className="xs:col-span-2 md:col-span-1">
              <Label
                htmlFor="subjectField"
                value={t("subjectEditForm.field")}
                className="text-xl font-semibold"
              />
              <TextInput
                id="subjectField"
                type="text"
                sizing="sm"
                className="mt-2"
                value={subjectField}
                onChange={(e) => setSubjectField(e.target.value)}
              />
            </div>

            {/* Subject Number */}
            <div className="xs:col-span-2 md:col-span-1">
              <Label
                htmlFor="subjectNum"
                value={t("subjectEditForm.subjectNum")}
                className="text-xl font-semibold"
              />
              <TextInput
                id="subjectNum"
                type="text"
                sizing="sm"
                className="mt-2"
                value={subjectNum}
                onChange={(e) => setSubjectNum(e.target.value)}
              />
            </div>

            {/* Subject Title */}
            <div className="col-span-2">
              <Label
                htmlFor="subjectTitle"
                value={t("subjectEditForm.subjectTitle")}
                className="text-xl font-semibold"
              />
              <TextInput
                id="subjectTitle"
                type="text"
                sizing="lg"
                className="mt-2"
                value={subjectTitle}
                onChange={(e) => setSubjectTitle(e.target.value)}
              />
            </div>

            {/* Subject Content */}
            <div className="col-span-2">
              <Label
                htmlFor="subjectContent"
                value={t("subjectEditForm.subjectContent")}
                className="text-xl font-semibold"
              />
              <Textarea
                id="subjectContent"
                required
                rows={4}
                className="mt-2"
                value={subjectContent}
                onChange={(e) => setSubjectContent(e.target.value)}
              />
            </div>

            {/* Negotiation Limit */}
            <div className="col-span-2 pt-8">
              <Label
                htmlFor="negotiationLimit"
                value={t("subjectEditForm.negotiationLimit")}
                className="text-xl font-semibold"
              />
              <TextInput
                id="negotiationLimit"
                type="text"
                sizing="sm"
                className="mt-2"
                value={negotiationLimit}
                onChange={(e) => setNegotiationLimit(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6" dir={direction}>
            {/* Related Matrix */}
            <div className="col-span-2 pt-8">
              <Label
                htmlFor="relatedMatrix"
                value={t("subjectEditForm.relatedMatrix")}
                className="text-xl font-semibold"
              />
              <Select
                id="relatedMatrix"
                className="mt-2"
                value={relatedMatrix?.title || ""} // Safely handle undefined relatedMatrix
                onChange={(e) => {
                  const selectedMatrix = matrix.find(
                    (item) => item.title === e.target.value
                  );

                  if (selectedMatrix) {
                    setRelatedMatrix({
                      ...selectedMatrix,
                    });
                  }
                }}
              >
                <option value="" disabled>
                  Select a Matrix
                </option>
                {matrix?.length > 0 &&
                  matrix.map((item) => (
                    <option key={item.id} value={item.title}>
                      {item.title}
                    </option>
                  ))}
              </Select>

              {/* Use useEffect to log the updated relatedMatrix */}
            </div>

            {/* Assigned Employee */}
            <div className="col-span-2 pt-8">
              <Label
                htmlFor="emp1"
                value={t("subjectEditForm.hiredEmp")}
                className="text-xl font-semibold"
              />
              <Select
                id="emp1"
                className="mt-2"
                value={emp1?.employeeName || ""} // Ensure emp1 is defined
                onChange={(e) => {
                  const selectedEmployee = employees.find(
                    (item) => item.employeeName === e.target.value
                  );
                  setEmp1({
                    ...emp1, // Retain current emp1 properties if needed
                    ...selectedEmployee, // Update with selected employee details
                  });
                }}
              >
                <option value="" disabled>
                  {t("subjectEditForm.chooseEmp")}
                </option>
                {employees?.length > 0 &&
                  employees.map((item) => (
                    <option key={item.id} value={item.employeeName}>
                      {item.employeeName}
                    </option>
                  ))}
              </Select>
            </div>

            {/* Notes */}
            <div className="col-span-2 pt-8">
              <Label
                htmlFor="notes"
                value={t("subjectEditForm.notes")}
                className="text-xl font-semibold"
              />
              <Textarea
                id="notes"
                rows={4}
                className="mt-2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Shared Employees */}
            <div className="col-span-2 pt-8">
              <Label
                value={t("subjectEditForm.sharedEmployees")}
                className="text-xl font-semibold"
              />
              {sharedEmployees.map((sharedEmployee, index) => (
                <div key={index} className="flex gap-4 mt-2">
                  <Select
                    className="w-1/2"
                    value={sharedEmployee.role}
                    onChange={(e) =>
                      handleSharedEmployeeChange(index, "role", e.target.value)
                    }
                  >
                    <option value="" disabled>
                      {t("subjectEditForm.chooseRole")}
                    </option>{" "}
                    {/* خيار افتراضي */}
                    <option value="مجتمعين">
                      {t("subjectEditForm.single")}
                    </option>
                    <option value="منفردين">
                      {t("subjectEditForm.grouped")}
                    </option>
                  </Select>

                  <Select
                    className="w-1/2"
                    value={sharedEmployee.empId}
                    onChange={(e) =>
                      handleSharedEmployeeChange(index, "empId", e.target.value)
                    }
                  >
                    {employees.map((item) => (
                      <option key={item.id} value={item.employeeId}>
                        {item.employeeName}
                      </option>
                    ))}
                  </Select>
                </div>
              ))}
              <Button
                type="button"
                onClick={handleAddSharedEmployee}
                className="mt-4"
              >
                {t("subjectEditForm.addNewEmp")}
              </Button>
            </div>

            {/* Save Button */}
            <div className="mt-6 flex justify-center">
              <div
                onClick={handleSave}
                className={`aux-button aux-curve aux-gold flex items-center justify-center text-lg font-bold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300 `}
              >
                <span className="flex items-center space-x-4 aux-text">
                  {t("subjectEditForm.save")}
                </span>
              </div>{" "}
            </div>
            {isPopupVisible && (
              <div style={popupStyles}>
                <div style={popupContentStyles}>
                  <p>{t("matrixForm.alert")}</p>
                  <button
                    onClick={() => {
                      setIsPopupVisible(false);
                      navigate(-1);
                    }}
                    className="text-red-600"
                  >
                    {t("text.close")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
const popupContentStyles = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  textAlign: "center",
};
const popupStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
