import React, {useEffect, useRef, useState } from "react"
import MaterialTable from "material-table"
import { get, post } from '../api/client'
import AddIcon from '@mui/icons-material/Add';

function Attendance({id, type}){
  console.log(id,type)
    const [attendance, setAttendance] = useState([])
    let data = useRef({})

    useEffect(()=>{
      if(type === 'student'){
        getCourses()
      }
      getAssistance()
    }, [])

    async function getCourses() {
        try {
          const list = await get(`/courses/enrolled/${id}`)
          list.forEach(course => {
            data.current[course.code_course] = course.name_course
          });
          setAttendance()
        } catch (error) {
          console.error(error);
        }
      }

      async function getAssistance(){
        try {
          const response = await get(`/assistance/${id}`)
          response.forEach((assistance)=>{
            const d = new Date(assistance.time);
            let time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()
            assistance.time = time;
          })

          setAttendance(response)
        } catch (error) {
          console.error(error);
        }
      }
    let columns
    if(type === 'student'){
      columns = [
        {
          title: "Curso",
          field: "code_course",
          lookup: data.current
        },
        {
          title: "Tiempo",
          field: "time",
          editable: "never"
        },
      ];
    }else{
      columns = [
        {
          title: "Tiempo",
          field: "time",
          editable: "never"
        },
      ];
    }

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
        <div className="table">
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
              if(type === 'student'){
                newRow['code_student'] = id
              }else{
                newRow['id_staff'] = id
              }
              newRow['time'] = dateTime
              console.log(dateTime)
              takeAttendance(newRow)
              resolve()
            })
          }}
          icons= {{
            Add: ()=> <button class="add-button"><AddIcon></AddIcon>Agregar</button>
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

export default Attendance