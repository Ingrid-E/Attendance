import React, { Component, useEffect, useRef, useState } from "react";
import Select from "react-select";
import MaterialTable from "material-table";
import { get, post,del, put} from "../api/client";
import "./components.css";
import swal from 'sweetalert'


function EditableCourses() {
  //let {teachers, campuses} = useRef([])
  let teachers = useRef({null: "Sin Confirmar"})
  let campuses = useRef({null: "Sin Confirmar"})
  const [data, setData] = useState([]);
  useEffect(() => {
    getCampuses();
    getProfessors();
    getCourses();
    console.log(data)
  }, []);

  async function getProfessors() {
    try {
      const response = await get("/professors");
      response.forEach((element) => {
        teachers.current[element.code] = element.name
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function getCampuses() {
    try {
      const response = await get("/campuses");
      response.forEach((element) => {
        campuses.current[element.id] = element.name + " " + element.location
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function getCourses() {
    try {
      setData(await get("/courses"));
    } catch (error) {
      console.error(error);
    }
  }

  const columns = [
    {
      title: "Code",
      field: "code",
      type: "numeric"
    },
    {
      title: "Name",
      field: "name",
    },
    {
      title: "Credits",
      field: "credits",
      type: "numeric"
    },
    {
      title: "Professor",
      field: "code_professor",
      lookup:teachers.current

    },
    {
      title: "Campus",
      field: "id_campus",
      lookup: campuses.current
    },
  ];


  function deleteCourse(code){
    swal({
        title:"Eliminar Curso",
        text: "Estas seguro que quieres eliminar el curso?",
        icon: "warning",
        buttons: ["Cancelar", "Eliminar"]
    }).then(async response =>{
            if(response){
                try{
                    await del(`/courses/${code}`)
                    swal({
                        text:"Curso Eliminado",
                        icon: "success"
                    })
                    getCourses();
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

  const updateCourse = async (data) =>{
    console.log("Updating Course")
    try{
      if(data.code_professor === 'null'){
        delete data.code_professor
      }
      if(data.id_campus === 'null'){
        delete data.id_campus
      }
      await put(`/courses/${data.code}`, data)
      swal({
        text:"Curso Actualizado",
        icon: "success"
    })

      getCourses();
  }catch(error){
    swal({
      text:"Error Actualizando",
      icon: "error"
  })
      console.error(error)
  }
  }

  const addCourse = async (data) => {
    try {
      if(data.code_professor === 'null'){
        delete data.code_professor
      }
      if(data.id_campus === 'null'){
        delete data.id_campus
      }
      console.log(data)
      await post(`/courses`, data);
      getCourses();
      swal({
        text:"Curso Agregado",
        icon: "success"
    })
    } catch (error) {
      swal({
        text:"Error Agregando Curso",
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
        title="Cursos"
        actions={[
          {
            icon: "delete",
            tooltip: "Delete User",
            onClick: (event, rowData) =>deleteCourse(rowData.code)
          }
        ]}
        editable={{
            onRowAdd:(newRow) => new Promise((resolve, reject)=>{
              console.log(newRow)
              addCourse(newRow)
              resolve()
            }),
            onRowUpdate:(newRow, oldRow)=> new Promise((resolve, reject)=>{
              console.log("New Row", newRow)
              updateCourse(newRow)
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

export default EditableCourses;
