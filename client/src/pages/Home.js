import React, { useEffect, useRef, useState } from 'react'
import '../App.css'
import { get } from '../api/client'
import {useLocation} from 'react-router-dom'
import EditableCourses from '../components/Courses'
import EditableStudents from '../components/Students'
import TakeAssistance from '../components/Attendance'

function Home(){
    console.log(useLocation().state)
    const {username,type} = useLocation().state
    let [state, setState] = useState({})
    let [student, setCode] = useState()
    useEffect(() =>{
        userInfo()
    }, [])
    async function userInfo(){
        try{
            const response = await get(`/users/${username}`)
            if(type === "student"){
                setCode("hola")
                console.log("CODIGO: ", student)
            }
            setState({
                id: response.id,
                name: response.name,
                address: response.address,
            })
        }catch(error){
            if(error.response.status === 404){
                //setState({error: "No existe el usuario"})
                console.log("No existe el usuario")
            }else if(error.response.status === 500){
                //setState({error: "INTERNAL ERROR SERVER"})
                console.error("Error")
            }
        }
    }

    return (
        <div>
            <h1> Bienvenido {state.name}</h1>
            {(type === 'admin')? (<div>
            <EditableCourses/>
            <br></br>
            <EditableStudents/>
            </div>):''}
            {(type === 'student')? (<div>
            <TakeAssistance
            student_code={student}/>
            </div>):''}
        </div>
    )
}

export default Home