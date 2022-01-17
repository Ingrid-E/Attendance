import React, {useEffect, useRef, useState } from "react"
import swal from 'sweetalert'
import MaterialTable from "material-table"
import { get, post } from '../api/client'


function TakeAssistance({student_code}){
    console.log("Take asistance student code: ", student_code)
    const [attendance, setAttendance] = useState([])
    let courses = useRef({})

    useEffect(()=>{
        getCourses()
        getAssistance()
    }, [])

    async function getCourses() {
        try {
          const list = await get(`/courses/enrolled/${student_code}`)
          list.forEach(course => {
            courses.current[course.code_course] = course.name_course
          });
        } catch (error) {
          console.error(error);
        }
      }

      async function getAssistance(){
        try {
          setAttendance(await get(`/assistance/${student_code}`))
        } catch (error) {
          console.error(error);
        }
      }

    const columns = [
        {
          title: "Curso",
          field: "code_course",
          lookup: courses.current
        },
        {
          title: "Tiempo",
          field: "time",
          editable: "never"
        },
      ];
    async function takeAttendance(data){
      console.log(data)
      try{
        await post(`/assistance`,data)
        getAssistance()
      }catch(error){
        console.error(error)
      }
    }
    return (
        <div>
                <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
          <MaterialTable
          columns={columns}
          data={attendance}
          title="Asistencia"
          editable={{
            onRowAdd:(newRow) => new Promise((resolve, reject)=>{
              let d = new Date()
              const dateTime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()
              newRow['code_student'] = student_code
              newRow['time'] = dateTime
              takeAttendance(newRow)
              resolve()
            })
          }}
          options={{
            actionsColumnIndex: -1,
            addRowPosition: "first",
            cellStyle: {textAlign:'center'},
            headerStyle: {textAlign:'center'}

          }}/>
        </div>
    )
}

export default TakeAssistance