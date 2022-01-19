import React, {useEffect, useRef, useState } from "react"
import MaterialTable from "material-table"
import { get, post,del } from '../api/client'
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
    }, [code_course])

    async function getAllStudents() {
      try {
        const response = await get("/students");
        response.forEach((element) => {
          all.current[element.code] = element.code + " " + element.name
        });
      } catch (error) {
        console.error(error);
      }
    }

      async function getEnrolled(){
        try {
            const response = await get(`/courses/enrolled/${code_course}`)
            setStudents(response)

        } catch (error) {
          console.error(error);
        }
      }

      const enrollStudent = async(data) => {
        data['code_course'] = code_course
        try {
          await post('/courses/enrolled', data);
          getEnrolled()
        } catch (error) {
          console.error(error)
        }
      };

      function deleteStudent(code){
        swal({
            title:"Eliminar Estudiante",
            text: "Estas seguro que quieres eliminar este estudiante?",
            icon: "warning",
            buttons: ["Cancelar", "Eliminar"]
        }).then(async response =>{
                if(response){
                    try{
                        await del(`/courses/enrolled/${code}`)
                        swal({
                            text:"Estudiante Eliminado",
                            icon: "success"
                        })
                        getEnrolled();
                    }catch(error){
                        swal({
                            text:"Error Eliminando",
                            icon: "error"
                        })
                        console.error(error)
                    }
                }
            }
        )
      }


    const columns = [
        {
          title: "Codigo",
          field: "code_student",
          lookup: all.current
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
          title="Matriculados"
          actions={[
            {
              icon: "delete",
              tooltip: "Delete User",
              onClick: (event, rowData) =>deleteStudent(rowData.code_student)
            }
          ]}
          editable={{
              onRowAdd:(newRow) => new Promise((resolve, reject)=>{
                console.log(newRow)
                enrollStudent(newRow)
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