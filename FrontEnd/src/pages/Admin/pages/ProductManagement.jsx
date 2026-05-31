import React, {useContext, useEffect, useState} from "react";
import {
    Box,
    Button,
    Typography,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Pagination
} from "@mui/material";
import {useAdminProduct} from "../../../context/AdminProductsContext";
import AddProductForm from "../components/AddProductDialog";
import EditProductForm from "../components/EditProductDialog";
import {CategoryContext} from "../../../context/CategoryContext";
import Loader from "../../../components/Loader";

const ProductManagement = () => {
    const {loading, products, fetchProducts, handleDeleteProduct} = useAdminProduct();
    const {categoryMap} = useContext(CategoryContext);

    const [openAddProductForm, setOpenAddProductForm] = useState(false);
    const [openEditProductForm, setOpenEditProductForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10); // You can adjust this value as needed
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        fetchProducts();
    }, []);

    // Pagination logic
    const filteredProducts =
        selectedCategory === "All"
            ? products
            : products.filter((p) => p.categoryID.toString() === selectedCategory);

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    return (
        <Box sx={{padding: 3}}>
            {loading && <Loader/>}
            <Typography variant="h4" gutterBottom>
                Quản lý Sản phẩm
            </Typography>
            <Box sx={{display: "flex", justifyContent: "center" , alignItems: "center", gap: 2, mb: 2}}>
                <Button
                    variant="contained"
                    onClick={() => setOpenAddProductForm(true)}
                    sx={{mb: 2}}
                    color="inherit"
                >
                    + Thêm sản phẩm
                </Button>

                {/* Category Filter */}
                <Box sx={{display: "flex", alignItems: "center"}}>
                    <Typography variant="caption">Phân loại: </Typography>
                    <select
                        value={selectedCategory}
                        onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            setCurrentPage(1);
                        }}
                        style={{
                            padding: "8px 12px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                            outline: "none",
                        }}
                    >
                        <option value="All">Tất cả</option>
                        {Object.entries(categoryMap).map(([id, name]) => (
                            <option key={id} value={id}>{name}</option>
                        ))}
                    </select>
                </Box>

                {/* Products Per Page */}
                <Box>
                    <Typography variant="caption">Sản phẩm/trang:</Typography>
                    <select
                        value={productsPerPage}
                        onChange={(e) => {
                            setProductsPerPage(parseInt(e.target.value));
                            setCurrentPage(1);
                        }}
                        style={{
                            padding: "8px 12px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                            outline: "none",
                        }}
                    >
                        {[10, 20, 50].map((num) => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </Box>

            </Box>
            <AddProductForm open={openAddProductForm} onClose={() => setOpenAddProductForm(false)}/>

            <EditProductForm
                open={openEditProductForm}
                onClose={() => {
                    setOpenEditProductForm(false);
                    setSelectedProduct(null);
                }}
                product={selectedProduct}
            />

            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Ảnh</TableCell>
                            <TableCell>Tên</TableCell>
                            <TableCell>Phân loại</TableCell>
                            <TableCell>Giá</TableCell>
                            <TableCell>Tồn kho</TableCell>
                            <TableCell align="center">Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedProducts.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell>{p.id}</TableCell>
                                <TableCell style={{display: 'flex', alignItems: 'center'}}>
                                    <img
                                        src={
                                            p.image.startsWith("https://")
                                                ? p.image
                                                : "http://localhost:8080/uploads/" + p.image
                                        }
                                        alt="Product"
                                        style={{
                                            width: '150px',
                                            height: '150px',
                                            objectFit: 'cover',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </TableCell>
                                <TableCell>{p.name}</TableCell>
                                <TableCell>{categoryMap[p.categoryID] || "unknown"}</TableCell>
                                <TableCell>{p.price.toLocaleString()}₫</TableCell>
                                <TableCell>{p.quantity}</TableCell>
                                <TableCell align="center">
                                    <Box display="flex" justifyContent="center" gap={1}>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => {
                                                setSelectedProduct(p);
                                                setOpenEditProductForm(true);
                                            }}
                                        >
                                            Sửa
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleDeleteProduct(p.id)}
                                            color="error"
                                        >
                                            Xóa
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Box sx={{display: "flex", justifyContent: "center", alignItems: 'center', mt: 4, gap: 3}}>
                    <Button
                        variant="outlined"
                        startIcon={<span>⬅</span>}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        sx={{
                            background: 'none',
                            px: 3,
                            py: 1.2,
                            borderRadius: 3,
                            textTransform: 'none',
                            fontWeight: 'bold',
                            boxShadow: 2,
                            backgroundColor: currentPage === 1 ? '#e0e0e0' : '#fff',
                            color: currentPage === 1 ? '#888' : '#1976d2',
                            '&:hover': {
                                backgroundColor: currentPage === 1 ? '#e0e0e0' : '#e3f2fd'
                            }
                        }}
                    >
                        Trang trước
                    </Button>

                    <Typography sx={{fontSize: '1.1rem', fontWeight: 100}}>
                        Trang <strong>{currentPage}</strong> / {totalPages}
                    </Typography>

                    <Button
                        variant="outlined"
                        endIcon={<span>➡</span>}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        sx={{
                            background: 'none',
                            px: 3,
                            py: 1.2,
                            borderRadius: 3,
                            textTransform: 'none',
                            fontWeight: 'bold',
                            boxShadow: 2,
                            backgroundColor: currentPage === totalPages ? '#e0e0e0' : '#fff',
                            color: currentPage === totalPages ? '#888' : '#1976d2',
                            '&:hover': {
                                backgroundColor: currentPage === totalPages ? '#e0e0e0' : '#e3f2fd'
                            }
                        }}
                    >
                        Trang sau
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default ProductManagement;
