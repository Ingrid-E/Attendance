import React, {useEffect, useRef, useState } from "react"
import MaterialTable from "material-table"
import { get, post } from '../api/client'
import "./components.css";
import swal from 'sweetalert'
import AddIcon from '@mui/icons-material/Add';


function Enroll({code_course}){
  console.log(code_course)
    const [students, setStudents] = useState([])
    let all = useRef([])
    useEffect(()=>{
      getAllStudents()
      getEnrolled()
    }, [])

    async function getAllStudents() {
      try {
        const response = await get("/students");
        response.forEach((element) => {
          all.current[element.code] = element.code
        });
        console.log("STUDENTS ", response)
      } catch (error) {
        console.error(error);
      }
    }

      async function getEnrolled(){
        try {
            const response = await get(`/courses/enrolled/${code_course}`)
            let list = []
            console.log(response)
            response.forEach(async (enrollment)=>{
              const student = await get(`/students/${enrollment.code_student}`)
              list.push(student)
            })
            setStudents(list)

        } catch (error) {
          console.error(error);
        }
      }

      const enrollStudent = async(data) => {
        data['code_course'] = code_course
        console.log(data)
        try {
          await post('/courses/enrolled', data);
          console.log(data)
        } catch (error) {
          console.error(error)
        }
      };

    const columns = [
        {
          title: "Codigo",
          field: "code",
          //lookup: all.current
        }
      ];

    return (
        <div className="table">
                <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
          <MaterialTable
          columns={columns}
          data={students}
          title="Asistencia"
          actions={[
            {
              icon: "delete",
              tooltip: "Delete User",
              onClick: (event, rowData) =>console.log("delete")
            }
          ]}
          editable={{
              onRowAdd:(newRow) => new Promise((resolve, reject)=>{
                console.log(newRow)
                enrollStudent(newRow)
                resolve()
              }),
              onRowUpdate:(newRow, oldRow)=> new Promise((resolve, reject)=>{
                console.log("Old Row", newRow)
                console.log("update")
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

export default Enroll