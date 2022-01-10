import React, { Component, useEffect, useRef, useState } from "react";
import Select from "react-select";
import MaterialTable from "material-table";
import { get, post,del } from "../api/client";
import "./components.css";
import swal from 'sweetalert'

function Editable() {
  let campuses = useRef([]);
  let teachers = useRef([{ label: "Sin Definir", value: null }]);
  let [state, setState] = useState({
    code: null,
    name: null,
    credits: null,
    id_campus: null,
    code_professor: null,
  });
  let [alert, setAlert] = useState("Sin crear");

  useEffect(() => {
    getCampuses();
    getProfessors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await post(`/course`, state);
      setAlert("Creado");
    } catch (error) {
      console.log("Error: ", error);
      if (error.response.status === 409) {
        setAlert("El Curso ya existe");
        console.error("El curso ya existe");
      }
    }
    console.log(alert);
  };

  const handleChange = function (e) {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const multipleChoice = function (value, name) {
    setState({
      ...state,
      [name.name]: value.value,
    });
  };

  async function getCampuses() {
    try {
      const response = await get("/campuses");
      response.forEach((element) => {
        campuses.current.push({
          value: element.id,
          label: element.name + " " + element.location,
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function getProfessors() {
    try {
      const response = await get("/professors");
      response.forEach((element) => {
        teachers.current.push({ value: element.code, label: element.name });
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} onChange={handleChange}>
        <label>
          Código
          <input type="number" name="code"></input>
        </label>
        <label>
          Nombre
          <input type="text" name="name"></input>
        </label>
        <label>
          Créditos
          <input type="number" name="credits"></input>
        </label>
        <label>
          Campus
          <Select
            onChange={multipleChoice}
            options={campuses.current}
            name="id_campus"
          />
        </label>
        <label>
          Profesores
          <Select
            onChange={multipleChoice}
            options={teachers.current}
            name="code_professor"
          />
        </label>
        <button type="submit">Crear Curso</button>
        <div>
          {alert === "Sin crear" ? (
            ""
          ) : (
            <h1>{alert === "Creado" ? "Curso Creado" : "Curso no Creado"}</h1>
          )}
        </div>
      </form>
    </div>
  );
}

function ShowCourses() {
  //let {teachers, campuses} = useRef([])
  let teachers = useRef({})
  let campuses = useRef({})
  const [data, setData] = useState([]);
  useEffect(() => {
    getCampuses();
    getProfessors();
    getCourses();
    console.log(campuses,teachers)
  }, []);

  async function getProfessors() {
    try {
      const response = await get("/professors");
      response.forEach((element) => {
        teachers.current[element.code] = element.name
      });
      console.log(teachers)
    } catch (error) {
      console.log(error);
    }
  }

  async function getCampuses() {
    try {
      const response = await get("/campuses");
      response.forEach((element) => {
        campuses.current[element.code] = element.name
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
      lookup:teachers

    },
    {
      title: "Campus",
      field: "id_campus",
      lookup: campuses
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
                    const action = await del(`/courses/${code}`).then(
                        ()=>{
                            getCourses()
                        }
                    )
                    swal({
                        text:"Curso Eliminado",
                        icon: "success"
                    })
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

  return (
    <div>
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
            icon: "edit",
            tooltip: "Editar curso",
            onClick: (event, rowData) => alert("Editar: " + rowData.name),
          },
          {
            icon: "delete",
            tooltip: "Delete User",
            onClick: (event, rowData) =>deleteCourse(rowData.code)
          },
          {
            icon: "add",
            tooltip: "Add User",
            isFreeAction: true,
            onClick: (event, newRow) => {},
          },
        ]}
        editable={{
            onRowAdd:(newRow) => new Promise((resolve, reject)=>{
                console.log(newRow)
            })
        }}
        options={{
          actionsColumnIndex: -1,
          addRowPosition: "first"
        }}
      />
    </div>
  );
}

export { Editable, ShowCourses };
