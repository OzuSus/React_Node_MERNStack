import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

import './App.css'
import Login from "./pages/login/index.jsx";
import Home from "./pages/home/index.jsx";
import Favorite from "./pages/Favorite/index.jsx";

import Header from "./components/header.jsx";
import Footer from "./components/Footer.jsx";
import {UserProvider} from "./context/UserContext.jsx";
import Register from "./pages/Register/index.jsx";
import {CategoryProvider} from "./context/CategoryContext.jsx";
import {FavoriteProvider} from "./context/FavoriteContext.jsx";
import React from "react";
import Cart from "./pages/Cart/index.jsx";
import {CartProvider} from "./context/CartContext.jsx";
import Shop from "./pages/Shop/index.jsx";
import {FilterProvider} from "./context/FilterContext.jsx";

// import Cart from "./pages/Cart/index.jsx";

function App() {
    return (
        <CategoryProvider>
            <FilterProvider>
                <CartProvider>
                    <FavoriteProvider>
                        <BrowserRouter>
                            <Header/>
                            <div className="mainApp">
                                <Routes>
                                    <Route path="/" element={<Home/>}/>
                                    <Route path="/Home" element={<Home/>}/>
                                    <Route path="/Shop" element={<Shop/>}/>
                                    <Route path="/Cart" element={<Cart/>}/>
                                    <Route path="/Login" element={<Login/>}/>
                                    <Route path="/Register" element={<Register/>}/>
                                    <Route path="/Favorite" element={<Favorite/>}/>
                                </Routes>
                            </div>
                            <Footer/>
                        </BrowserRouter>
                    </FavoriteProvider>
                </CartProvider>
            </FilterProvider>
        </CategoryProvider>
    )
}

export default App
