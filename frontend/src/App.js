import logo from './logo.svg';
import './App.css';
import React from 'react';
import {userState, useEffect} from 'react';
import axios from 'axios';


//Routing
import {createBrowserRouter, createRoutesFromElements,RouterProvider, Route} from "react-router-dom"

//pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateTodo from './pages/CreateTodo';

//layouts
import RootLayout from './layouts/RootLayout';
import DetailsPage from './pages/DetailsPage';
const baseURL="http://127.0.0.1:8000"

const router= createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootLayout/>}>
          <Route index element={<Home/>}/>
          <Route path="login" element={<Login/>}/>
          <Route path="register" element={<Register/>}/>
          <Route path='create' element={<CreateTodo/>}/>
          <Route path='details/:pageid' element={<DetailsPage/>}/>
    </Route>   
  )

)


axios.defaults.xsrfCookieName='csrftoken';
axios.defaults.xsrfHeaderName="X-CSRFToken";
axios.defaults.withCredentials=true;

function App() {
  const refreshToken = localStorage.getItem('refreshToken');
  useEffect(()=>{
    setInterval(()=>{
      
      if(refreshToken!=null){
        const url=baseURL+'/api/account/refresh/';
      fetch(url,{
        method:"POST",
        headers:{
          "Content-Type":'application/json'
        },
        body:JSON.stringify({
          refresh:refreshToken,
        })
      }).then((response)=>{
        if(response.status===401){
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('accessToken');
          refreshToken=null
        }
      })
      }
      
    },1000000);

  },[]);

  return (
    <RouterProvider router={router}/>
    
  );
}

export default App;
