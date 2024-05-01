import { useState } from 'react'
import { createBrowserRouter,createRoutesFromElements,Route,RouterProvider } from 'react-router-dom'
import './App.css'
import { Layout } from './pages/Layout'
import { Home } from './pages/Home'
import { Play } from './pages/Play'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Auth } from './pages/Auth'
function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Layout />}>
        <Route index element={<Auth />} />
        <Route path="/home" element={<Home />} />

        <Route path="/play" element={<Play/>} />
      </Route>
    )
  )
  return (
    <>
      <ToastContainer />
      <RouterProvider router={router}/>
    </>
  )
}

export default App
