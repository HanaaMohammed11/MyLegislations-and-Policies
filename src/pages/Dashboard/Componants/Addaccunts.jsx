/* eslint-disable no-unused-vars */
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import emailjs from "emailjs-com";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore"; // Import deleteDoc and doc from firestore
import { deleteUser, updatePassword } from "firebase/auth";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import db from "../../../config/firebase";
import axios from "axios";
import "../../Dashboard/btns.css";

import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

emailjs.init("vRSobHxRYCwqKML2w");

// Other imports remain the same

export default function AddAccounts() {
  const { t, i18n } = useTranslation("global");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State to handle search input
  const usersCollection = collection(db, "users");
  const auth = getAuth();
  const [user, setUser] = useState([]);

  // Provide a default value for accountType
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    accountType: "employee",
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required(t("validation.firstName.required")),
    lastName: Yup.string().required(t("validation.lastName.required")),
    email: Yup.string()
      .email(t("validation.email.invalid"))
      .required(t("validation.email.required")),
    password: Yup.string()
      .min(6, t("validation.password.minLength"))
      .required(t("validation.password.required")),
  });

  const handleRegister = async (values, { setSubmitting }) => {
    const { email, password, firstName, lastName, accountType } = values;

    try {
      setError("");
      setSubmitting(true);
      setRefresh(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const docRef = await addDoc(usersCollection, {
        ownerAdmin: localStorage.getItem("id"),
        firstname: firstName,
        lastname: lastName,
        email: email,
        ID: user.uid,
        accountType: accountType,
        password: password,
      });

      await emailjs.send("service_1go7kvh", "template_wcch0ap", {
        to_Email: email,
        from_name: "CorGov",
        reply_to: email,
        User_Email: email,
        User_passwors: password,
      });

      console.log("تم إرسال البريد الإلكتروني بنجاح!");
    } catch (error) {
      console.error("Error during registration:", error);
      setError("حدث خطأ أثناء تسجيل المستخدم.");
    } finally {
      setSubmitting(false);
      setOpenModal(false);
      setRefresh(false);
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const q = collection(db, "users");
        const querySnapshot = await getDocs(q);
        const employeeList = querySnapshot.docs.map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        }));
        setEmployees(employeeList);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, [refresh]);

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
    });

    return () => unsubscribe();
  }, []);

  // Filter the employees based on the search query
  const filteredEmployees = employees.filter(
    (employee) =>
      (employee?.firstname && employee.firstname.includes(searchQuery)) ||
      (employee?.email && employee.email.includes(searchQuery))
  );

  // async function deleteUserByUid(uid) {
  //   setRefresh(true)
  //   try {
  //     const response = await axios.delete(`https://delete-user-node-js.vercel.app/delete-user/${uid}`);
  //

  //     if (response.status == 200) {
  //       console.log(response.data.message);
  //     } else {
  //       console.log(response.data.message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }finally{
  //     setRefresh(false)
  //   }
  // }

  async function deleteUserByUid(uid, employeeId) {
    setRefresh(true);
    try {
      const response = await axios.delete(
        `https://delete-user-node-js.vercel.app/delete-user/${uid}`
      );

      try {
        // Make sure employeeId is defined and valid
        if (employeeId) {
          await deleteDoc(doc(db, "users", employeeId));
          console.log("Employee deleted successfully!");
        } else {
          console.error("Invalid employeeId");
        }
      } catch (error) {
        console.error("Error deleting employee: ", error);
      }
      if (response.status === 200) {
        console.log(response.data.message);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setRefresh(false);
    }
  }
  const [employeeData, setEmployeeData] = useState({
    firstname: "",
    lastname: "",
    accountType: "",
    docId: "", // Assuming you also need the document ID to update it
  });
  const handleEditClick = (selectedEmployee) => {
    setEmployeeData({
      firstname: selectedEmployee.firstname,
      lastname: selectedEmployee.lastname,
      accountType: selectedEmployee.accountType,
      docId: selectedEmployee.docId, // Assuming docId is a part of the employee data
    });
    setOpenEditModal(true);
  };
  const updateAcc = async (docId, values) => {
    try {
      await updateDoc(doc(db, "users", docId), {
        firstname: values.firstname,
        lastname: values.lastname,
        accountType: values.accountType,
      });
      console.log("Account updated successfully!");
      // Optionally handle success, e.g., show a success message
    } catch (error) {
      console.error("Error updating account: ", error);
      setError("Failed to update account");
    }
  };

  const handleEditSubmit = async (values) => {
    // Update the employee data based on the form input
    setEmployeeData((prev) => ({
      ...prev,
      firstname: values.firstName,
      lastname: values.lastName,
      accountType: values.accountType,
    }));
    await updateAcc(); // Call update function
  };
  const fetchOldPassword = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.password; // كلمة المرور القديمة
      } else {
        console.error("User document not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching old password:", error);
      return null;
    }
  };

  // دالة لتحديث كلمة المرور في Firebase
  async function updatePasswordFunction({ values, oldPasswordFromDB }) {
    const user = auth.currentUser;
    if (user) {
      try {
        // تحقق من أن كلمة المرور القديمة المدخلة تطابق كلمة المرور المحفوظة في قاعدة البيانات
        if (values.oldpass !== oldPasswordFromDB) {
          throw new Error("The old password is incorrect");
        }

        // تحديث كلمة المرور في Firebase Authentication
        await updatePassword(user, values.newpass);
        console.log("Password updated successfully!");
      } catch (error) {
        console.error("Error updating password: ", error);
        setError(error.message || "Error updating password");
      }
    } else {
      throw new Error("User not found");
    }
  }

  // دالة عند إرسال النموذج (Submit) لتغيير كلمة المرور
  const handlePasswordChange = async (values) => {
    try {
      const oldPasswordFromDB = await fetchOldPassword(localStorage.getItem("id")); // استرجاع كلمة المرور القديمة من Firestore

      if (!oldPasswordFromDB) {
        throw new Error("Failed to retrieve old password");
      }

      await updatePasswordFunction({ values, oldPasswordFromDB });
      console.log("Password change successful");
    } catch (error) {
      console.error("Password change error:", error);
      setError(error.message || "Error changing password");
    }
  };
  return (
    <div className=" ">
      <div
        className={` flex flex-col md:flex-row w-full justify-end items-center gap-4 md:gap-9 z-10 sticky lg:fixed md:fixed sm:sticky xs:sticky `}
      >
        <div
          className="btn-button sm:w-[100%] lg:w-[13%] md:w-[13%] text-center btn-curve btn-gold flex items-center text-lg font-bold hover:bg-opacity-90 transform hover:scale-105 transition-transform duration-300"
          onClick={() => setOpenModal(true)}
        >
          <span className="whitespace-nowrap flex items-center space-x-2 btn-text">
            {t("addaccount.createAccount")}{" "}
          </span>
        </div>

        {/* Search Input */}
        <div className="search flex justify-center items-center">
          <input
            type="text"
            className="rounded-full text-right h-9 px-4"
            placeholder={t("matrixForm.search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <Modal
        style={{ paddingBottom: "70%", paddingTop: "50%" }}
        show={openModal}
        size="md"
        popup
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header title={t("addaccount.createAccount")} />
        <Modal.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleRegister}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="space-y-6" dir={direction}>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                    {t("addaccount.createAccount")}
                  </h3>

                  {error && <div className="text-red-500">{error}</div>}

                  <div>
                    <div className="mb-2 block">
                      <Label
                        htmlFor="firstName"
                        value={t("addaccount.firstName")}
                      />
                    </div>
                    <Field
                      name="firstName"
                      type="text"
                      as={TextInput}
                      id="firstName"
                      placeholder={t("addaccount.firstName")}
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <div className="mb-2 block">
                      <Label
                        htmlFor="lastName"
                        value={t("addaccount.lastName")}
                      />
                    </div>
                    <Field
                      name="lastName"
                      type="text"
                      as={TextInput}
                      id="lastName"
                      placeholder={t("addaccount.lastName")}
                    />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="email" value={t("addaccount.email")} />
                    </div>
                    <Field
                      name="email"
                      type="email"
                      as={TextInput}
                      id="email"
                      placeholder="name@company.com"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <div className="mb-2 block">
                      <Label
                        htmlFor="password"
                        value={t("addaccount.password")}
                      />
                    </div>
                    <Field
                      name="password"
                      type="password"
                      as={TextInput}
                      id="password"
                      placeholder="••••••••"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label
                        htmlFor="accountType"
                        value={t("addaccount.accType")}
                      />
                    </div>
                    <Field
                      as="select"
                      name="accountType"
                      id="accountType"
                      className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                      {user.length > 0 &&
                        user[0].accountType === "superAdmin" && (
                          <option value="superAdmin">
                            {t("addaccount.superAdmin")}
                          </option>
                        )}
                      <option value="admin">{t("addaccount.admin")}</option>
                      <option value="employee">{t("addaccount.emp")}</option>
                    </Field>
                    <ErrorMessage
                      name="accountType"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="w-full">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting
                        ? t("addaccount.registering")
                        : t("addaccount.register")}
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      {/* Employees Table */}
      <div className="overflow-x-auto flex flex-col items-center w-full " >
        <div
          dir={direction}
          className="overflow-x-auto w-full p-4 rounded-lg shadow-lg mt-10"
        >
          <table
            className="table-auto w-full min-w-[300px] bg-[#D3A17A] text-sm md:text-base lg:mt-9 md:mt-9 mt-16 sm:mt-14 "
          >
            <thead dir={direction}>
              <tr dir={direction} className="bg-[#D3A17A] text-white">
                <th className="px-2 md:px-4 py-2">
                  {t("addaccount.firstName")}
                </th>
                <th className="px-2 md:px-4 py-2">{t("addaccount.email")}</th>
                <th className="px-2 md:px-4 py-2">
                  {t("addaccount.password")}
                </th>
                <th className="px-2 md:px-4 py-2">{t("addaccount.accType")}</th>
                <th className="px-2 md:px-4 py-2">{t("subjectInfo.action")}</th>
              </tr>
            </thead>
            <tbody className="text-xl font-semibold text-center">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <tr key={employee.ID} className="border-t hover:bg-gray-100">
                    <td className="px-2 md:px-4 py-2">
                      {employee.firstname} {employee.lastname}
                    </td>
                    <td className="px-2 md:px-4 py-2">{employee.email}</td>
                    <td className="px-2 md:px-4 py-2">{employee.password}</td>
                    <td className="px-2 md:px-4 py-2">
                      {employee.accountType}
                    </td>
             
                      <td className="px-2 md:px-4 py-2 flex justify-center space-x-2">
                        <AiFillDelete
                          className="text-red-500 cursor-pointer me-3"
                          onClick={() =>
                            deleteUserByUid(employee.ID, employee.docId)
                          }
                        />
                        <td>
                          <button onClick={() => handleEditClick(employee)}>
                            <AiFillEdit />
                          </button>
                        </td>
                        <Modal
        show={openEditModal}
        onClose={() => setOpenEditModal(false)}
        title="Change Password"
      >
        <Formik
          initialValues={{
            oldpass: "",
            newpass: "",
            confirmNewPass: "",
          }}
          validationSchema={Yup.object().shape({
            oldpass: Yup.string().required("Old password is required"),
            newpass: Yup.string().required("New password is required"),
            confirmNewPass: Yup.string()
              .oneOf([Yup.ref("newpass"), null], "Passwords must match")
              .required("Confirm new password is required"),
          })}
          onSubmit={handlePasswordChange}
        >
          {({ values, handleChange, handleSubmit, errors }) => (
            <form onSubmit={handleSubmit}>
              <input
                type="password"
                name="oldpass"
                placeholder="Old Password"
                value={values.oldpass}
                onChange={handleChange}
              />
              {errors.oldpass && <div>{errors.oldpass}</div>}
              
              <input
                type="password"
                name="newpass"
                placeholder="New Password"
                value={values.newpass}
                onChange={handleChange}
              />
              {errors.newpass && <div>{errors.newpass}</div>}
              
              <input
                type="password"
                name="confirmNewPass"
                placeholder="Confirm New Password"
                value={values.confirmNewPass}
                onChange={handleChange}
              />
              {errors.confirmNewPass && <div>{errors.confirmNewPass}</div>}
              
              <button type="submit">Change Password</button>
            </form>
          )}
        </Formik>
      </Modal>
                      </td>
           
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-10 text-center">
                    {t("addaccount.noUsers")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
