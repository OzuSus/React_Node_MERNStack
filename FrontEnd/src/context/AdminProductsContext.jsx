import {createContext, useContext, useState, useEffect} from "react";
import {showConfirmDialog, showErrorDialog, showSuccessDialog} from "../utils/Alert";
import {api} from "../utils/api";

export const AdminProductsContext = createContext();

export const useAdminProduct = () => useContext(AdminProductsContext);

const normalizeProduct = (product) => ({
    ...product,
    id: product.id || product._id,
    categoryID: product.categoryID || product.id_category?._id || product.id_category,
    price: Number(product.price || 0),
    quantity: Number(product.quantity || 0),
});

export const AdminProductsProvider = ({children}) => {
    const [loading, setLoading] = useState(true);
    const [products, setAllProducts] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const productResponse = await api.get("/products", {params: {limit: 1000}});
            const data = productResponse.data.product || productResponse.data.products || productResponse.data;
            setAllProducts(Array.isArray(data) ? data.map(normalizeProduct) : []);
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
                await api.delete(`/products/${id}`);
                setLoading(false);
                await setError("");
                await showSuccessDialog("Thành công", "Đã xóa sản phẩm.");
                await fetchProducts();
            } catch (err) {
                console.error("Error deleting product:", err);
                const message = err.response?.data?.message || "Không thể xóa sản phẩm.";
                await setError(message);
                await showErrorDialog("Lỗi", message);
            }
        }else {
            // Người dùng đã huỷ => không làm gì cả
            setLoading(false);
            console.log("User cancelled the delete action.");
        }
    }

    const handleUploadFile = async (filename) => {
        try {
            const response = await api.get(`/uploads/${encodeURIComponent(filename)}`);
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
            formData.append("price", prize);
            formData.append("description", description);
            formData.append("id_category", id_category);
            if (image) {
                formData.append("image", image);
            }

            await api.put(`/products/${id}`, formData, {
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
            const message = err.response?.data?.message || "Không thể cập nhật thông tin.";
            setError(message);
            await showErrorDialog("Lỗi", message);
        }
    }

    const addProduct = async (name, quantity, prize, description, id_category, image) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("name", name);
            formData.append("quantity", quantity);
            formData.append("price", prize);
            formData.append("description", description);
            formData.append("id_category", id_category);
            formData.append("image", image);

            await api.post("/products", formData, {
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
            const message = err.response?.data?.message || "Không thể đổi thông tin.";
            setError(message);
            await showErrorDialog("Lỗi", message);
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
