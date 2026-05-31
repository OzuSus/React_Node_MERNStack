import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import {Delete} from "@mui/icons-material";
import AddCategoryModal from "../model/AddCategoryModal";
import {api, getAssetUrl} from "../../../utils/api";
import {showConfirmDialog, showErrorDialog, showSuccessDialog} from "../../../utils/Alert";

const normalizeCategory = (category) => ({
    ...category,
    id: category.id || category._id,
    thumbnail: category.thumbnail || category.image,
    status: category.status || "ACTIVE",
});

const CategoryManagement = () => {
    const [openModal, setOpenModal] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get("/categories");
            const data = Array.isArray(response.data) ? response.data : response.data.categories || [];
            setCategories(data.map(normalizeCategory));
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const handleDeleteCategory = async (id) => {
        const confirmDelete = await showConfirmDialog("Ban co chac muon xoa danh muc nay?", "warning");
        if (!confirmDelete.isConfirmed) return;

        try {
            await api.delete(`/categories/${id}`);
            await showSuccessDialog("Thanh cong", "Da xoa danh muc.");
            fetchCategories();
        } catch (error) {
            await showErrorDialog("Loi", error.response?.data?.message || "Khong the xoa danh muc.");
        }
    };

    return (
        <Box sx={{padding: 3}}>
            <Typography variant="h4" sx={{fontWeight: 600, mb: 2}}>
                Quan ly Danh muc
            </Typography>

            <Button
                variant="contained"
                onClick={() => setOpenModal(true)}
                sx={{mb: 3, boxShadow: 3, "&:hover": {boxShadow: 6}}}
            >
                + Them danh muc
            </Button>

            <Card sx={{boxShadow: 3}}>
                <CardContent>
                    <Table sx={{minWidth: 650}}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{fontWeight: "bold"}}>ID</TableCell>
                                <TableCell sx={{fontWeight: "bold"}}>Ten</TableCell>
                                <TableCell sx={{fontWeight: "bold"}}>Thumbnail</TableCell>
                                <TableCell sx={{fontWeight: "bold"}} align="center">Trang thai</TableCell>
                                <TableCell sx={{fontWeight: "bold"}} align="center">Hanh dong</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.map((cat) => (
                                <TableRow key={cat.id} sx={{"&:hover": {backgroundColor: "#f5f5f5"}}}>
                                    <TableCell>{cat.id}</TableCell>
                                    <TableCell>{cat.name}</TableCell>
                                    <TableCell>
                                        <img
                                            src={getAssetUrl(cat.thumbnail, "/assets/jewelry.png")}
                                            alt="Category Thumbnail"
                                            style={{width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px"}}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={cat.status}
                                            color={cat.status === "ACTIVE" ? "success" : "error"}
                                            size="small"
                                            sx={{textTransform: "capitalize"}}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDeleteCategory(cat.id)}
                                            sx={{"&:hover": {backgroundColor: "#ffebee"}}}
                                        >
                                            <Delete/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <AddCategoryModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onAddCategory={fetchCategories}
            />
        </Box>
    );
};

export default CategoryManagement;
