import React, { useState } from 'react'
import '../App.css'
import { post } from '../api/client'
import {useNavigate, useParams} from 'react-router-dom'


function Login(){

    let [state, setState] = useState({
        username: "",
        password: "",
        type: ""
    })
    const navigate = useNavigate()

    const handleChange = function(e){
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    const  handleSubmit = async(e) => {
        console.log(state)
        e.preventDefault();
        fetchUser(state)
    }


    async function fetchUser(login) {
        try{
            const response = await post(`/login`, login)
            setState({
                ...state,
                type: response
            })
            navigate('/home',state)

        }catch(error){
            //console.log(error)
            if(error.response.status === 404){
                //setState({error: "No existe el usuario"})
                console.log("No existe el usuario")
            }else if(error.response.status === 500){
                //setState({error: "INTERNAL ERROR SERVER"})
                console.error("Error")
            }
        }

    }


    return(
        <div>
            <h1>Login</h1>
            <p > {state && state.nombre ? 'Bienvenido '+ state.nombre: '' } </p>
            <form onSubmit={handleSubmit} onChange={handleChange}>
                <input type='username' name='username' />
                <input type='password' name='password'/>
                <button type="submit">Log In</button>
            </form>
            <p > {state && state.error ? state.error: '' } </p>

        </div>
    )
}

export default Login