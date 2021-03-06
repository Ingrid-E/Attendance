import React, { useEffect, useState, useRef } from "react";
import "./pages.css";
import { get } from "../api/client";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Courses from "../components/Courses";
import Students from "../components/Students";
import Staff from "../components/Staff";
import Professors from "../components/Professors";
import Attendance from "../components/Attendance";
import Enroll from '../components/Enroll'
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";


function Home() {
  let { username, type } = useLocation().state;
  console.log(username, type);
  const [user, setUser] = useState([]);
  const [student, setStudent] = useState([]);
  const [staff, setStaff] = useState([]);
  const [professor, setProfessor] = useState([]);
  const [visibility, setVisibility] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    try {
      const userInfo = await get(`/users/${username}`);
      setUser(userInfo);
      if (type === "student") {
        const studentInfo = await get(`/students/${userInfo.id}`);
        setStudent(studentInfo);
      }
      if (type === "staff") {
        const staffInfo = await get(`/staff/${userInfo.id}`);
        console.log('Info ', staffInfo);
        setStaff(staffInfo);
      }

      if(type === "professor"){
        const professorInfo = await get(`/professors/${userInfo.id}`);
        getCourses(professorInfo)
      }
    } catch (error) {
      if (error.response.status === 404) {
        console.error("No existe el usuario");
      } else if (error.response.status === 500) {
        console.error("Error");
      }
    }
  }
  async function getCourses(professor_info) {
    try {
      const response =await get(`/courses/assigned/${professor_info.code}`)
      setProfessor({...professor_info, courses: response})
    } catch (error) {
      console.error(error);
    }
  }
  function show(content) {
    if (visibility === content) {
      setVisibility("");
    } else {
      setVisibility(content);
    }
  }

  return (
    <div className="Home">
      <div className="side-bar">
        <ul>
          <li className="user">
            <AccountCircleIcon className="icon" />
            <p>
              {user.name !== undefined ? user.name.split(" ")[0] : "empty"}{" "}
            </p>
            <ExitToAppIcon
              onClick={() => {
                navigate("/", { replace: true });
              }}
              className="exit"
            />
          </li>

          {type === "admin" ? (
            <div>
              <li
                className={visibility === "courses" ? "active" : ""}
                onClick={() => show("courses")}
              >
                <SchoolIcon className="icon"></SchoolIcon>
                <p>Cursos</p>
              </li>
              <li
                className={visibility === "staff" ? "active" : ""}
                onClick={() => show("staff")}
              >
                {type === "admin"}
                <WorkIcon className="icon"></WorkIcon>
                <p>Personal</p>
              </li>
              <li
                className={visibility === "students" ? "active" : ""}
                onClick={() => show("students")}
              >
                {type === "admin"}
                <EmojiPeopleIcon className="icon"></EmojiPeopleIcon>
                <p>Estudiantes</p>
              </li>
              <li
                className={visibility === "professors" ? "active" : ""}
                onClick={() => show("professors")}
              >
                {type === "admin"}
                <CoPresentIcon className="icon"></CoPresentIcon>
                <p>Profesores</p>
              </li>
            </div>
          ) : null}

          {type === "student" || type === "staff"  ? (
            <div>
              <li
                className={visibility === "assistance" ? "active" : ""}
                onClick={() => show("assistance")}
              >
                <SchoolIcon className="icon"></SchoolIcon>
                <p>Asistencia</p>
              </li>
            </div>
          ) : null}

          {type === 'professor' && professor.courses !== undefined?(
              professor.courses?.map((course) =>(
                 <li
                 className={visibility === course.code ? "active" : ""}
                 onClick={()=>show(course.code)}>
                     <SchoolIcon className="icon"></SchoolIcon>
                     <p>{course.name}</p>
                 </li>
              ))

          ): null}


        </ul>
      </div>
      <div className="tables">
        {visibility === "courses" ? <Courses /> : null}
        {visibility === "students" ? <Students /> : null}
        {visibility === "staff" ? <Staff /> : null}
        {visibility === "professors" ? <Professors/> : null}
        {type === 'professor' && visibility !== '' ? <Enroll code_course={visibility}/> : null}
        {visibility === "assistance" ? <Attendance id={type ==='student'? student.code: staff.id_staff} type={
          type
        }/> : null}
      </div>
    </div>
  );
}

export default Home;
