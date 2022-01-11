import React, {useEffect, useRef, useState } from "react"
import swal from 'sweetalert'
import MaterialTable from "material-table"
import { get } from '../api/client'


function TakeAssistance({student_code}){
    console.log("STUDENT CODE", student_code)
    const [courses, setCourses] = useState({})
    useEffect(()=>{
        getCourses()
    }, [])

    async function getCourses() {
        try {
          setCourses(await get(`/courses/enrolled/${student_code}`))
          console.log(courses)
        } catch (error) {
          console.error(error);
        }
      }

    const columns = [
        {
          title: "Curso",
          field: "code_course",
          lookup: courses
        },
      ];

    return (
        <div>

        </div>
    )
}

export default TakeAssistance