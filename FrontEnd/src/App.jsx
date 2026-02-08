import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

import './App.css'
import Login from "./pages/login/index.jsx";
import Home from "./pages/home/index.jsx";
import Header from "./components/header.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  return (
      <BrowserRouter>
          {/*<Header/>*/}
          <div className="mainApp">
              <Routes>
                  <Route path="/" element={<Home/>}/>
                  <Route path="/Home" element={<Home/>}/>
                  <Route path="/Login" element={<Login/>}/>
              </Routes>
          </div>
          <Footer/>
      </BrowserRouter>
  )
}

export default App
