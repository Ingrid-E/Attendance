import React, { useEffect,useRef,useState } from 'react'
import "./pages.css";
import { get } from '../api/client'
import {useLocation} from 'react-router-dom'


import EditableCourses from '../components/Courses'
import EditableStudents from '../components/Students'
import TakeAssistance from '../components/Attendance'


import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


function Home(){
    const {username,type} = useLocation().state
    const [user, setUser] = useState([])
    const [student, setStudent] = useState([])
    const [visibility, setVisibility] = useState('')

    useEffect(() =>{
        getUser()
    }, [])

    async function getUser(){
        try{
            const userInfo = await get(`/users/${username}`)
            setUser(userInfo)
            if(type === 'student'){
                const studentInfo = await get(`/students/${userInfo.id}`)
                setStudent(studentInfo)
            }
        }catch(error){
            if(error.response.status === 404){
                console.error("No existe el usuario")
            }else if(error.response.status === 500){
                console.error("Error")
            }
        }
    }

    function show(content){
        if(visibility === content){
            setVisibility('')
        }else{
            setVisibility(content)
        }
    }

    return (
        <div className='Home'>
            <div className="side-bar">
                <ul>
                    <li className='user'>
                    <AccountCircleIcon className='icon'></AccountCircleIcon>
                    <p>{user.name !== undefined? user.name.split(' ')[0]:'empty'} </p>
                    </li>
                    <li className={visibility === 'courses'? 'active':''} onClick={()=>show('courses')}>{type === 'admin'}
                    <SchoolIcon className='icon'></SchoolIcon>
                    <p>Cursos</p>
                    </li>
                    <li>{type === 'admin'}
                    <WorkIcon className='icon'></WorkIcon>
                    <p>Personal</p>
                    </li>
                    <li className={visibility === 'students'? 'active':''} onClick={()=>show('students')}>{type === 'admin'}
                    <EmojiPeopleIcon className='icon'></EmojiPeopleIcon>
                    <p>Estudiantes</p>
                    </li>
                    <li>{type === 'admin'}
                    <CoPresentIcon className='icon'></CoPresentIcon>
                    <p>Profesores</p>
                    </li>
                </ul>
            </div>
            <div className='tables'>
                {visibility === 'courses'? <EditableCourses/>:null}
                {visibility === 'students'? <EditableStudents/>:null}
            </div>

        </div>
    )
}

export default Home