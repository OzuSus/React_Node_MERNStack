import React, {createContext, useCallback, useContext, useState} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {showConfirmDialog, showErrorDialog, showSuccessDialog} from "../utils/Alert";

export const FavoriteContext = createContext();

export const FavoriteProvider = ({children}) => {
    const [favoriteItems, setFavoriteItems] = useState([]);
    const [categoryNames, setCategoryNames] = useState({});
    // const [isInWishList, setIsInWishList] = useState(false);

    const fetchFavoriteItems = useCallback(async (userId) => {
        try {
            const response = await fetch("http://localhost:5000/favorite",{
                method: "GET",
                credentials: "include",
                // headers: {
                //     "Content-Type": "application/json"
                // }
            });
            const items = response.json();
            setFavoriteItems(items);

            // Chỉ khi favoriteItems được lấy xong mới tiếp tục xử lý categoryNames
            const categoryPromises = items.map(item =>
                axios.get(`http://localhost:5000/api/categories/${item.id_product.id_category}`)
            );
            const categoryResponses = await Promise.all(categoryPromises);

            const categoryMap = categoryResponses.reduce((acc, res) => {
                acc[res.data._id] = res.data.name;
                return acc;
            }, {});

            setCategoryNames(categoryMap);  // Cập nhật categoryNames
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu yêu thích:", error);
        }
    }, []);

    const isInWishList = async (userId, productId) => {
        try {
            const response = await axios.get("http://localhost:8080/api/favorites/isInWishList", {
                params: {
                    userId,
                    productId
                }
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi kiểm tra yêu thích:", error);
            return false;
        }
    };

    const addToFavorite = async (userId, productId) => {
        const result = await showConfirmDialog("Bạn có muốn thêm vào yêu thích?");
        if (result.isConfirmed) {
            try {
                await axios.post("http://localhost:8080/api/favorites/add", null, {
                    params: { userId: userId, productId: productId}
                });
                await showSuccessDialog("Thành công", "Đã thêm vào yêu thích");
                await fetchFavoriteItems(userId);
            } catch (error) {
                console.error("Add to cart error:", error);
                await showErrorDialog("Lỗi", "Không thể thêm vào yêu thích");
            }
        } else {
            // Người dùng đã huỷ => không làm gì cả
        }

    };

    const deleteProductInFavorite = async (userId, productId) => {
        const result = await showConfirmDialog("Bạn có chắc muốn xóa sản phẩm khỏi yêu thích?", "warning");
        if (result.isConfirmed) {
            try {
                await axios.delete("http://localhost:8080/api/favorites/delete", {
                    params: {userId: userId, productId: productId}
                });
                await showSuccessDialog("Thành công", "Đã xóa sản phẩm khỏi yêu thích");
                await fetchFavoriteItems(userId);
            } catch (error) {
                console.error("Delete from cart error:", error);
                await showErrorDialog("Lỗi", "Không thể xóa sản phẩm trong yêu thích");
            }
        } else {
            // Người dùng đã huỷ => không làm gì cả
        }

    };

    return (
        <FavoriteContext.Provider value={{ favoriteItems, setFavoriteItems, addToFavorite, fetchFavoriteItems, categoryNames, deleteProductInFavorite, isInWishList }}>
            {children}
        </FavoriteContext.Provider>
    );
};
