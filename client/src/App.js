import React, {useState} from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from "./pages/Login";
import Home from "./pages/Home";
import './App.css';
import axios from "axios"

function App(){

  const [state, setState] = useState({
    loggedInStatus: "NOT_LOGGED_IN",
    user: {}
  })

  function checkLoginStaus(){
    axios.get("http://localhost:9000", {withCredentials: true})
    .then(response=>{
      console.log("loffed in? ", response)
    })
    .catch(error=>{
      console.log("check login error", error)
    })
  }

    return(
      <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/home' element={<Home/>}/>
        </Routes>
      </Router>
      </div>
    )

}

export default App;
