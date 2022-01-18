import React, {useEffect, useState, useRef } from "react";
import MaterialTable from "material-table";
import { get, post,del, put} from "../api/client";
import "./components.css";
import swal from 'sweetalert'
import AddIcon from '@mui/icons-material/Add';



function Professors() {
  let campuses = useRef({})
  let staff = useRef({})
  const [data, setData] = useState([]);
  useEffect(() => {
    getStaff();
    getCampuses();
    getProfessors();
    console.log(data)
  }, []);


  async function getCampuses() {
    try {
      const response = await get("/campuses");
      response.forEach((element) => {
        campuses.current[element.id] = element.name + " " + element.location
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function getStaff() {
    try {
      const response = await get("/staff");
      response.forEach((element) => {
        staff.current[element.id_staff] = element.id + ' ' + element.name
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function getProfessors() {
    try {
      setData(await get('/professors'));
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
      title: "Personal",
      field: "id_staff",
      lookup: staff.current
    },

  ];


  function deleteProfessors(code){
    swal({
        title:"Eliminar Curso",
        text: "Estas seguro que quieres eliminar este profesor?",
        icon: "warning",
        buttons: ["Cancelar", "Eliminar"]
    }).then(async response =>{
            if(response){
                try{
                    await del(`/professors/${code}`)
                    swal({
                        text:"Profesor Eliminado",
                        icon: "success"
                    })
                    getProfessors();
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

  const updateProfessors = async (data, code) =>{
    console.log(code)
    try{
      await put(`/professors/${code}`, data)
      swal({
        text:"Profesor Actualizado",
        icon: "success"
    })

      getProfessors();
  }catch(error){
    swal({
      text:"Error Actualizando",
      icon: "error"
  })
      console.error(error)
  }
  }

  const addProfessors = async (data) => {
    try {
      console.log(data)
      await post(`/professors`, data);
      getProfessors();
      swal({
        text:"Profesor Agregado",
        icon: "success"
    })
    } catch (error) {
      if (error.response.status === 409) {
        swal({
            text:"Profesor ya existe!",
            icon: "warning"
        })
      }else{
        swal({
            text:"Error Agregando",
            icon: "error"
        })
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
        title="Profesores"
        actions={[
          {
            icon: "delete",
            tooltip: "Delete User",
            onClick: (event, rowData) =>deleteProfessors(rowData.code)
          }
        ]}
        editable={{
            onRowAdd:(newRow) => new Promise((resolve, reject)=>{
              console.log(newRow)
              addProfessors(newRow)
              resolve()
            }),
            onRowUpdate:(newRow, oldRow)=> new Promise((resolve, reject)=>{
              updateProfessors(newRow, oldRow.code)
              resolve()

            }),
        }}
        icons= {{
          Add: ()=> <button class="add-button"><AddIcon></AddIcon>Agregar</button>
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

export default Professors;
