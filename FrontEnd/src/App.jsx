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
import {ProductProvider} from "./context/ProductContext.jsx";
import React from "react";
import Cart from "./pages/Cart/index.jsx";
import {CartProvider} from "./context/CartContext.jsx";
import Shop from "./pages/Shop/index.jsx";
import {FilterProvider} from "./context/FilterContext.jsx";
import ProductDetails from "./pages/ProductDetails/index.jsx";
import {CheckoutProvider} from "./context/CheckoutContext.jsx";
import Checkout from "./pages/Checkout/index.jsx";
import Profile from "./pages/Profile/index.jsx";
import {ProfileProvider} from "./context/ProfileContext.jsx";
import ChangePassWord from "./pages/ChangePassWord/index.jsx";
import {ChangePasswordProvider} from "./context/ChangePasswordContext.jsx";
import ForgotPassword from "./pages/ForgotPassword/index.jsx";
import OrderSuccess from "./pages/OrderSuccess/index.jsx";
import FailedOrder from "./pages/FailedOrder/index.jsx";
import VNPaymentReturn from "./pages/VNPaymentReturn/index.jsx";
import PurchaseHistory from "./pages/PurchaseHistory/index.jsx";
import {PurchaseHistoryProvider} from "./context/PurchaseHistoryContext.jsx";
import AdminLayout from "./pages/Admin/index.jsx";
import WelcomeAdmin from "./components/WelcomeAdmin.jsx";
import Dashboard from "./pages/Admin/pages/Dashboard.jsx";
import OrdersAdmin from "./pages/Admin/pages/Orders.jsx";
import Customers from "./pages/Admin/pages/Customer.jsx";
import ProductManagement from "./pages/Admin/pages/ProductManagement.jsx";
import CategoryManagement from "./pages/Admin/pages/CategoryManagement.jsx";
import ApproveCTV from "./pages/Admin/pages/ApproveCTV.jsx";


// import Cart from "./pages/Cart/index.jsx";

function App() {
    return (
        <PurchaseHistoryProvider>
            <CheckoutProvider>
                <CategoryProvider>
                    <FilterProvider>
                        <ProfileProvider>
                            <CartProvider>
                                <FavoriteProvider>
                                    <ChangePasswordProvider>
                                        <BrowserRouter>
                                            <Header/>
                                            <div className="mainApp">
                                                <Routes>
                                                    <Route path="/" element={<Home/>}/>
                                                    <Route path="/Home" element={<Home/>}/>
                                                    <Route path="/Shop" element={<Shop/>}/>
                                                    <Route path="/Cart" element={<Cart/>}/>
                                                    <Route path="/Login" element={<Login/>}/>
                                                    <Route path="/Forgot-Password" element={<ForgotPassword/>}/>
                                                    <Route path="/Register" element={<Register/>}/>
                                                    <Route path="/Favorite" element={<Favorite/>}/>
                                                    <Route path="/Products/:prodID" element={
                                                        <ProductProvider>
                                                            <ProductDetails/>
                                                        </ProductProvider>
                                                    }/>
                                                    <Route path="/Checkout" element={<Checkout/>}/>
                                                    <Route path="/Profile" element={<Profile/>}/>
                                                    <Route path="/ChangePassWord" element={<ChangePassWord/>}/>
                                                    <Route path="/OrderSuccess" element={<OrderSuccess/>}/>
                                                    <Route path="/FailedOrder" element={<FailedOrder/>}/>
                                                    <Route path="/payment-return" element={<VNPaymentReturn/>}/>
                                                    <Route path="/PurchaseHistory" element={<PurchaseHistory/>}/>
                                                    <Route path="/admin" element={<AdminLayout/>}>
                                                        <Route index element={<WelcomeAdmin />} />
                                                        <Route path="dashboard" element={<Dashboard/>}/>
                                                        <Route path="orders" element={<OrdersAdmin/>}/>
                                                        <Route path="users" element={<Customers/>}/>
                                                        <Route path="products" element={<ProductManagement/>}/>
                                                        <Route path="categories" element={<CategoryManagement/>}/>
                                                        <Route path="approve-ctv" element={<ApproveCTV/>}/>
                                                    </Route>
                                                </Routes>
                                            </div>
                                            <Footer/>
                                        </BrowserRouter>
                                    </ChangePasswordProvider>
                                </FavoriteProvider>
                            </CartProvider>
                        </ProfileProvider>
                    </FilterProvider>
                </CategoryProvider>
            </CheckoutProvider>
        </PurchaseHistoryProvider>

    )
}

export default App
