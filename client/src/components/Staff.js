import React, {useEffect,useRef, useState } from "react";
import MaterialTable from "material-table";
import { get, post,del, put} from "../api/client";
import "./components.css";
import swal from 'sweetalert'
import AddIcon from '@mui/icons-material/Add';



function Staff() {
  //let {teachers, campuses} = useRef([])

  const [data, setData] = useState([]);
  let campuses = useRef({})

  useEffect(() => {
    getCampuses();
    getStaff();
    console.log(data)
  }, []);


  async function getStaff() {
    try {
      setData(await get("/staff"));
    } catch (error) {
      console.error(error);
    }
  }

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

  const columns = [
    {
      title: "Identificación",
      field: "id",
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
      title: "Salario",
      field: "salary",
    },
    {
      title: "EPS",
      field: "eps",
    },
    {
      title: "ARL",
      field: "arl",
    },
    {
      title: "Sede",
      field: "id_campus",
      lookup: campuses.current
    },
    {
      title: "Contraseña",
      field: "password"
    }
  ];


  function deleteStaff(id){
    swal({
        title:"Eliminar Curso",
        text: "Estas seguro que quieres eliminar este personal?",
        icon: "warning",
        buttons: ["Cancelar", "Eliminar"]
    }).then(async response =>{
            if(response){
                try{
                    await del(`/users/${id}`)
                    swal({
                        text:"Personal Eliminado",
                        icon: "success"
                    })
                    getStaff();
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

  const updateStaff = async (data, id) =>{
   
    try{
      console.log(data)
      await put(`/staff/${id.staff}&${id.user}`, data)
      swal({
        text:"Personal Actualizado",
        icon: "success"
    })

      getStaff();
  }catch(error){
    swal({
      text:"Error Actualizando",
      icon: "error"
  })
      console.error(error)
  }
  }

  const addStaff = async (data) => {
    try {
      console.log(data)
      await post(`/staff`, data);
      getStaff();
      swal({
        text:"Personal Agregado",
        icon: "success"
    })
    } catch (error) {
      swal({
        text:"Error Agregando",
        icon: "error"
    })
      if (error.response.status === 409) {
        console.error("El curso ya existe");
      }
    }
  };

  return (
    <div class="table staff">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
      <MaterialTable
        columns={columns}
        data={data}
        title="Personal"
        actions={[
          {
            icon: "delete",
            tooltip: "Delete User",
            onClick: (event, rowData) =>deleteStaff(rowData.id)
          }
        ]}
        editable={{
            onRowAdd:(newRow) => new Promise((resolve, reject)=>{
              console.log(newRow)
              addStaff(newRow)
              resolve()
            }),
            onRowUpdate:(newRow, oldRow)=> new Promise((resolve, reject)=>{
              console.log("Old Row", newRow)
              updateStaff(newRow, {user: oldRow.id, staff: oldRow.id_staff})
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

        }}
      />
    </div>
  );
}

export default Staff;
