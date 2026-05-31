import {createContext, useContext, useState, useEffect} from "react";
import axios from "axios";
import {UserContext} from "./UserContext";
import {useParams} from "react-router-dom";
import {showConfirmDialog, showErrorDialog, showSuccessDialog} from "../utils/Alert";

export const AdminProductsContext = createContext();

export const useAdminProduct = () => useContext(AdminProductsContext);

export const AdminProductsProvider = ({children}) => {
    const {user} = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [products, setAllProducts] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const productResponse = await axios.get("http://localhost:8080/api/products");
            setAllProducts(productResponse.data);
            setError("");
        } catch (err) {
            setLoading(false);
            console.error("Error fetching products:", err);
            setError(err.response?.data?.message || "Không thể tải sản phẩm.");
        }finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        const confirmDelete = await showConfirmDialog("Bạn có chắc muốn xóa sản phẩm này?", "warning");
        if (confirmDelete.isConfirmed) {
            try {
                setLoading(true)
                await axios.delete("http://localhost:8080/api/products/deleteProduct", {
                    params: {idProduct: id}
                });
                setLoading(false);
                await setError("");
                await showSuccessDialog("Thành công", "Đã xóa sản phẩm.");
                await fetchProducts();
            } catch (err) {
                console.error("Error deleting product:", err);
                await setError(err.response?.data?.message || "Không thể xóa sản phẩm.");
                await showErrorDialog("Lỗi", error || "Không thể xóa sản phẩm.");
            }
        }else {
            // Người dùng đã huỷ => không làm gì cả
            setLoading(false);
            console.log("User cancelled the delete action.");
        }
    }

    const handleUploadFile = async (filename) => {
        try {
            const response = await axios.get(`http://localhost:8080/uploads/${encodeURIComponent(filename)}`);
            return response.data;
        } catch (error) {
            console.error("Error uploading file:", error);
            setError(error.response?.data?.message || "Cannot upload file.");
        }
    }

    const handleEditProduct = async (id, name, quantity, prize, description, id_category, image) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("name", name);
            formData.append("quantity", quantity);
            formData.append("prize", prize);
            formData.append("description", description);
            formData.append("id_category", id_category);
            if (image) {
                formData.append("image", image);
            }

            await axios.put(`http://localhost:8080/api/products/editProduct/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            setLoading(false);
            await fetchProducts();
            await setError("");
            await showSuccessDialog("Thành công", "Đã cập nhật sản phẩm.");
        } catch (err) {
            setLoading(false);
            console.error("Error updating product:", err);
            setError(err.response?.data?.message || "Không thể cập nhật thông tin.");
            await showErrorDialog("Lỗi", setError || "Không thể cập nhật thông tin.");
        }
    }

    const addProduct = async (name, quantity, prize, description, id_category, image) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("name", name);
            formData.append("quantity", quantity);
            formData.append("prize", prize);
            formData.append("description", description);
            formData.append("id_category", id_category);
            formData.append("image", image);

            await axios.post("http://localhost:8080/api/products/createProduct", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            setLoading(false);
            await fetchProducts();
            await setError("");
            await showSuccessDialog("Thành công", "Đã thêm sản phẩm.");
        } catch (err) {
            setLoading(false);
            console.error("Error adding product:", err);
            setError(err.response?.data?.message || "Không thể đổi thông tin.");
            await showErrorDialog("Lỗi", setError || "Không thể đổi thông tin.");
        }finally {
            setLoading(false);
        }
    }

    return (
        <AdminProductsContext.Provider
            value={{products, loading, error, fetchProducts, addProduct, handleDeleteProduct, handleEditProduct}}>
            {children}
        </AdminProductsContext.Provider>
    );
}