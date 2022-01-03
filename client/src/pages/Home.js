import React, { useState } from 'react'
import '../App.css'
import {useLocation, useNavigationType, useParams, useRoutes} from 'react-router-dom'
function Home({user}){
    const location = user.getParam('username')
    console.log('Datos', location)
    return (
        <div>
            <h1> Bienvenido</h1>
        </div>
    )
}

export default Home