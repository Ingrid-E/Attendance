import React, { useState} from "react";
import "../App.css";
import { post } from "../api/client";
import { useNavigate, useLocation } from "react-router-dom";
import { TextField, InputAdornment, Button } from "@material-ui/core";
import { AccountCircle, VpnKey } from "@material-ui/icons";
import "./pages.css";
import Logo from './img/Logo_Univalle.png'

function Login() {


  let [state, setState] = useState({
    username: "ini",
    password: "ini",
    type: "",
    error: ""
  });
  console.log(state)
  const navigate = useNavigate();

  const handleChange = function (e) {
    setState({
      ...state,
      [e.target.name]: e.target.value,
      error:''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(state.username === 'ini' && state.password === 'ini'){
        setState({...state, username:'', password:''})
    }else if(state.username === 'ini'){
        setState({...state, username:''})
    }else if(state.password === 'ini'){
        setState({...state, password:''})
    }else{
        fetchUser(state);
    }
  };

  async function fetchUser(login) {
    try {
      const response = await post(`/login`, login);
      state.type = response;
      navigate("/home", { state: state });
    } catch (error) {
      //console.log(error)
      if (error.response.status === 404) {
        setState({...state, error:'El Usuario no Existe'})
      } else if (error.response.status === 500) {
        console.error(error);
      }
    }
  }

  return (
    <div className="LogIn">
        <img className="logo" src={Logo}></img>
    <div className="leftSide">
      <form onSubmit={handleSubmit} onChange={handleChange}>
        <h1 className="title">Login</h1>
        <TextField
          type="text"
          name="username"
          placeholder="Username"
          size="small"
          variant="outlined"
          error = {state.username.trim() === ''}
          helperText = {state.username.trim() === ''? 'Ingresar un valor': ''}
          InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle
                  style={{
                    fill: "#2C4252"
                    }}
                  />
                </InputAdornment>
              ),
          }}
        />

        <TextField
          type="password"
          name="password"
          placeholder="Password"
          size="small"
          variant="outlined"
          error = {state.password.trim() === ''}
          helperText = {state.password.trim() === ''? 'Ingresar un valor': ''}
          InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                  <VpnKey
                  style={{
                      fill: "#2C4252"
                  }}/>
                </InputAdornment>
              ),
          }}
        />
        <p className="error-text">{state.error === ''? '':state.error}</p>
        <Button type ="submit" className="button" variant="contained">Log In</Button>
      </form>
    </div>
    <div className="rightSide"></div>
    </div>
  );
}

export default Login;
