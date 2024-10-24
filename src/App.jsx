import {
  HashRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import db from "./config/firebase";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import MatrixList from "./pages/Dashboard/Componants/Matrix/MatrixList";
import MatrixEditForm from "./pages/Dashboard/Componants/Matrix/MatrixEditForm";
import MatrixForm from "./pages/Dashboard/Componants/Matrix/MatrixForm";
import Form from "./pages/Login/Form";
import Home from "./pages/Home/Home";
import AdminUsers from "./pages/Dashboard/Componants/users/AdminUsers";
import MatrixLists from "./pages/Users/Matrixs/MatrixLists";
import SubjectEditForm from "./pages/Dashboard/Componants/Subjects/SubjectEditForm";
import MatrixInfo from "./pages/Users/Matrixs/MatrixInfo";
import SubjectInfo from "./pages/Users/Subjects/SubjectInfo";
import AddAccounts from "./pages/Dashboard/Componants/Addaccunts";
import EditTheme from "./pages/Dashboard/Componants/EditTheme";
import SubjectsList from "./pages/Dashboard/Componants/Subjects/SubjectList";
import SubjectsLists from "./pages/Users/Subjects/SubjectList";
import AdminMatrixInfo from "./pages/Dashboard/Componants/Matrix/MatrixInfo";
import AdminSubjectInfo from "./pages/Dashboard/Componants/Subjects/AdminSubInfo";


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserInFirestore = async (userId) => {
      try {
        const q = query(collection(db, "users"), where("ID", "==", userId)); 
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          console.log("User found in Firestore:", querySnapshot.docs[0].data());
          setIsLoggedIn(true);
        } else {
          console.log("User not found in Firestore with ID:", userId);
          setIsLoggedIn(false);
          navigate("/login");
        }
      } catch (error) {
        console.error("Error checking Firestore: ", error);
        setIsLoggedIn(false);
        navigate("/login");
      }
    };

    const userId = localStorage.getItem("id");
    if (userId) {
      console.log("User ID found: ", userId);
      checkUserInFirestore(userId);
    } else {
      setIsLoggedIn(false);
      navigate("/login");
    }
  }, [navigate]);

  console.log(isLoggedIn);

  return (
    <Routes>
      {isLoggedIn ? (
        <>
          <Route path="/" element={<Home />} />

          <Route path="/Matrix" element={<MatrixLists />} />
          <Route path="/subjects" element={<SubjectsLists />} />
          <Route path="/MatrixInfo" element={<MatrixInfo />} />
          <Route path="/subjectInfo" element={<SubjectInfo />} />
          <Route path="/AdminSubjectInfo" element={<AdminSubjectInfo />} />
          <Route path="/admin-subjects" element={<SubjectsList />} />
          <Route path="/acc" element={<AddAccounts />} />
          <Route path="/dashboard" element={<AdminDashboard />} />

          <Route path="/editsubject" element={<SubjectEditForm />} />
 
          <Route path="/AdminMtrixInfo" element={<AdminMatrixInfo />} />

          <Route path="/edit-Theme" element={<EditTheme />} />
          <Route path="/AdminUsers" element={<AdminUsers />} />
          <Route path="/MatrixList" element={<MatrixList />} />
          <Route path="/MatrixEditForm" element={<MatrixEditForm />} />
          <Route path="/MatrixForm" element={<MatrixForm />} />
        </>
      ) : (
        <Route path="/login" element={<Form />} />
      )}
    </Routes>
  );
}
