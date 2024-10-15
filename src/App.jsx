import {
  HashRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import MatrixList from "./pages/Dashboard/Componants/Matrix/MatrixList";
import MatrixEditForm from "./pages/Dashboard/Componants/Matrix/MatrixEditForm";
import MatrixForm from "./pages/Dashboard/Componants/Matrix/MatrixForm";
import Form from "./pages/Login/Form";
import Home from "./pages/Home/Home";
import Users from "./pages/Users/Employee/Users";
import UserInfo from "./pages/Users/Employee/UserInfo";
import AdminUserCard from "./pages/Dashboard/Componants/users/AdminUserCard";
import AdminUsers from "./pages/Dashboard/Componants/users/AdminUsers";
import MatrixLists from "./pages/Users/Matrixs/MatrixLists";
import UserForm from "./pages/Dashboard/Componants/users/AddUserForm";
import EditUserForm from "./pages/Dashboard/Componants/users/EditeUserForm";
import SubjectEditForm from "./pages/Dashboard/Componants/Subjects/SubjectEditForm";
import MatrixInfo from "./pages/Users/Matrixs/MatrixInfo";
import SubjectInfo from "./pages/Users/Subjects/SubjectInfo";
import AdminUserInfo from "./pages/Dashboard/Componants/users/userInfo";
import Proxyemployeeinfo from "./pages/Dashboard/Componants/users/proxyemployeeinfo";
import AddAccounts from "./pages/Dashboard/Componants/Addaccunts";
import EditProxyrForm from "./pages/Dashboard/Componants/users/editProxy";
import UerProxy from "./pages/Users/Employee/userProxy";
import EditTheme from "./pages/Dashboard/Componants/EditTheme";
import SubjectsList from "./pages/Dashboard/Componants/Subjects/SubjectList";
import SubjectsLists from "./pages/Users/Subjects/SubjectList";
import AdminMatrixInfo from "./pages/Dashboard/Componants/Matrix/MatrixInfo";
import AdminSubjectInfo from "./pages/Dashboard/Componants/Subjects/AdminSubInfo";

export default function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("id");
    if (userId) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      navigate("/login");
    }
  }, [navigate]);

  return (
    <Routes>
      {isLoggedIn ? (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/userinfo" element={<UserInfo />} />
          <Route path="/users" element={<Users />} />
          <Route path="/Matrix" element={<MatrixLists />} />
          <Route path="/subjects" element={<SubjectsLists />} />
          <Route path="/MatrixInfo" element={<MatrixInfo />} />
          <Route path="/userProxy" element={<UerProxy />} />
          <Route path="/subjectInfo" element={<SubjectInfo />} />
          <Route path="/AdminSubjectInfo" element={<AdminSubjectInfo />} />
          <Route path="/admin-subjects" element={<SubjectsList />} />
          <Route path="/editproxy" element={<EditProxyrForm />} />
          <Route path="/acc" element={<AddAccounts />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/proxyemployeeinfo" element={<Proxyemployeeinfo />} />
          <Route path="/adduser" element={<UserForm />} />
          <Route path="/edituser" element={<EditUserForm />} />
          <Route path="/editsubject" element={<SubjectEditForm />} />
          <Route path="/AdminUserInfo" element={<AdminUserInfo />} />
          <Route path="/AdminUserCard" element={<AdminUserCard />} />
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
