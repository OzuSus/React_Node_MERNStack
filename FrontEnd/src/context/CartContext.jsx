import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {showConfirmDialog, showErrorDialog, showSuccessDialog} from "../utils/Alert";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [categoryNames, setCategoryNames] = useState({});

    const fetchCartItems = async (userId) => {
        try {
            const response = await fetch("http://localhost:5000/cart", {
                method:"GET",
                credentials: "include",
            });
            const items = await response.json();
            setCartItems(items);
            const categoryPromises = items.map(item => axios.get(`http://localhost:5000/categories/${item.id_product.id_category}`));
            const categoryResponses = await Promise.all(categoryPromises);
            const categoryMap = categoryResponses.reduce((acc, res) => {
                acc[res.data._id] = res.data.name;
                return acc;
            }, {});

            setCategoryNames(categoryMap);

            const total = items.reduce((sum, item) => sum + item.id_product.price * item.quantity, 0);
            setTotalPrice(total);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu giỏ hàng:", error);
        }
    };

    const addToCart = async (productId, userId) => {
        const result = await showConfirmDialog("Bạn có muốn thêm vào giỏ hàng?");
        if (result.isConfirmed) {
            try {
                const response = await fetch("http://localhost:5000/cart/add", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ productId: productId })
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Unknown error occurred");
                }
                await showSuccessDialog("Thành công", "Đã thêm vào giỏ hàng");
                await fetchCartItems(userId);
            } catch (error) {
                console.error("Add to cart error:", error);
                await showErrorDialog("Lỗi", "Không thể thêm vào giỏ hàng");
            }
        } else {
            // Người dùng đã huỷ => không làm gì cả
        }

    };

    const deteleProductInCart = async (userId, productId) => {
        const result = await showConfirmDialog("Bạn có chắc muốn xóa sản phẩm khỏi giỏ hàng?", "warning");
        if (result.isConfirmed) {
            try {
                const response = await fetch("http://localhost:5000/cart/remove", {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ productId: productId })
                });
                if(!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Unknown error occurred");
                }
                await showSuccessDialog("Thành công", "Đã xóa sản phẩm khỏi giỏ hàng");
                await fetchCartItems(userId);
            } catch (error) {
                console.error("Delete from cart error:", error);
                await showErrorDialog("Lỗi", "Không thể xóa sản phẩm trong giỏ hàng");
            }
        } else {
            // Người dùng đã huỷ => không làm gì cả
        }

    };
    const increaseQuantity = async (userId, productId) => {
        try {
            await fetch("http://localhost:5000/cart/increase", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ productId: productId })
            });
            await fetchCartItems(userId);
        } catch (error) {
            console.error("Lỗi tăng số lượng sản phẩm:", error);
            await showErrorDialog("Lỗi", "Không thể tăng số lượng sản phẩm");
        }
    };

    const decreaseQuantity = async (userId, productId, currentQuantity) => {
        if (currentQuantity === 1) {
            await deteleProductInCart(userId, productId);
        } else {
            try {
                await fetch("http://localhost:5000/cart/decrease", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ productId: productId })
                });
                await fetchCartItems(userId);
            } catch (error) {
                console.error("Lỗi giảm số lượng:", error);
                await showErrorDialog("Lỗi", "Không thể giảm số lượng sản phẩm");
            }
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, setCartItems, addToCart, fetchCartItems, totalPrice, categoryNames, deteleProductInCart, increaseQuantity, decreaseQuantity }}>
            {children}
        </CartContext.Provider>
    );
};
