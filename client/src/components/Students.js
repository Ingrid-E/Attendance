import React, { Component, useEffect, useRef, useState } from "react";
import Select from "react-select";
import MaterialTable from "material-table";
import { get, post,del, put} from "../api/client";
import "./components.css";
import swal from 'sweetalert'


function EditableStudents() {
  //let {teachers, campuses} = useRef([])
  let teachers = useRef({null: "Sin Confirmar"})
  let campuses = useRef({null: "Sin Confirmar"})
  const [data, setData] = useState([]);
  useEffect(() => {
    getStudents();
    console.log(data)
  }, []);


  async function getStudents() {
    try {
      setData(await get("/students"));
    } catch (error) {
      console.error(error);
    }
  }

  const columns = [
    {
      title: "Identificación",
      field: "id",
      type: "numeric"
    },
    {
      title: "Codigo Estudiantil",
      field: "code",
      type: "numeric"
    },
    {
      title: "Nombre",
      field: "name",
    },
    {
      title: "Dirección",
      field: "address",
    },
    {
      title: "Contraseña",
      field: "password"
    }
  ];


  function deleteStudent(code){
    swal({
        title:"Eliminar Curso",
        text: "Estas seguro que quieres eliminar el curso?",
        icon: "warning",
        buttons: ["Cancelar", "Eliminar"]
    }).then(async response =>{
            if(response){
                try{
                    await del(`/students/${code}`)
                    swal({
                        text:"Estudiante Eliminado",
                        icon: "success"
                    })
                    getStudents();
                }catch(error){
                    swal({
                        text:"Error eliminando",
                        icon: "error"
                    })
                    console.error(error)
                }

            }
        }
    )
  }

  const updateStudent = async (data, code) =>{
    console.log(code)
    try{
      await put(`/students/${code}`, data)
      swal({
        text:"Estudiante Actualizado",
        icon: "success"
    })

      getStudents();
  }catch(error){
    swal({
      text:"Error Actualizando",
      icon: "error"
  })
      console.error(error)
  }
  }

  const addStudent = async (data) => {
    try {
      console.log(data)
      await post(`/students`, data);
      getStudents();
      swal({
        text:"Estudiante Agregado",
        icon: "success"
    })
    } catch (error) {
      swal({
        text:"Error Agregando Estudiante",
        icon: "error"
    })
      if (error.response.status === 409) {
        console.error("El curso ya existe");
      }
    }
  };

  return (
    <div class="table">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
      <MaterialTable
        columns={columns}
        data={data}
        title="Estudiantes"
        actions={[
          {
            icon: "delete",
            tooltip: "Delete User",
            onClick: (event, rowData) =>deleteStudent(rowData.code)
          }
        ]}
        editable={{
            onRowAdd:(newRow) => new Promise((resolve, reject)=>{
              console.log(newRow)
              addStudent(newRow)
              resolve()
            }),
            onRowUpdate:(newRow, oldRow)=> new Promise((resolve, reject)=>{
              console.log("New Row", newRow)
              updateStudent(newRow, oldRow.code)
              resolve()

            })
        }}
        options={{
          actionsColumnIndex: -1,
          addRowPosition: "first",
          cellStyle: {textAlign:'center'},
          headerStyle: {textAlign:'center'}

        }}
      />
    </div>
  );
}

export default EditableStudents;
