import React, {useContext, useEffect, useState} from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Paper
} from "@mui/material";
import {useAdminProduct} from "../../../context/AdminProductsContext";
import {CategoryContext} from "../../../context/CategoryContext";
import "./AdminProductDialog.css";
import Loader from "../../../components/Loader";

const EditProductForm = ({open, onClose, product}) => {
    const {loading, handleEditProduct} = useAdminProduct();
    const {categoryMap} = useContext(CategoryContext);

    const [previewImage, setPreviewImage] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [productImage, setProductImage] = useState(null);
    const [formValues, setFormValues] = useState({
        name: '',
        price: '',
        quantity: '',
        description: '',
    });

    useEffect(() => {
        if (product) {
            setFormValues({
                name: product.name || '',
                price: product.price || '',
                quantity: product.quantity || '',
                description: product.description || '',
            });
            setSelectedCategory(product.categoryID || '');
            setProductImage(null);
            setPreviewImage(product.image.startsWith("https://")
                ? product.image
                : `http://localhost:8080/uploads/${product.image}`);
        }
    }, [product]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        if ((name === 'price' || name === 'quantity') && !/^\d*$/.test(value)) return;
        setFormValues(prev => ({...prev, [name]: value}));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProductImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleEditProduct(
            product.id,
            formValues.name,
            formValues.quantity,
            formValues.price,
            formValues.description,
            selectedCategory,
            productImage
        );
        onClose();
    };

    return (
        <Dialog open={open}
                onClose={loading ? undefined : onClose}
                disableEscapeKeyDown={loading}
                maxWidth="md"
                fullWidth>
            <DialogTitle className="product-dialog__title" sx={{fontWeight: 'bold'}}>Sửa sản phẩm</DialogTitle>
            <form onSubmit={loading ? undefined : handleSubmit}>
                <DialogContent>
                    <Paper elevation={3} sx={{p: 2}}>
                        <Grid container spacing={3}>
                            {/* LEFT SIDE - IMAGE */}
                            <Grid item xs={12} md={5}>
                                <Box>
                                    {/*<Typography className="product-dialog__section-title">*/}
                                    {/*    Ảnh sản phẩm*/}
                                    {/*</Typography>*/}

                                    {/* Input file ẩn */}
                                    <input
                                        type="file"
                                        id="product-image-input"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{display: 'none'}}
                                    />

                                    {/* Ảnh nhấn được */}
                                    {previewImage && (
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="product-dialog__image"
                                            style={{cursor: 'pointer'}}
                                            onClick={() => document.getElementById("product-image-input").click()}
                                        />
                                    )}
                                </Box>

                            </Grid>

                            {/* RIGHT SIDE - FORM FIELDS */}
                            <Grid item xs={12} md={7}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Tên sản phẩm"
                                            name="name"
                                            value={formValues.name}
                                            onChange={handleInputChange}
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Giá"
                                            name="price"
                                            value={formValues.price}
                                            onChange={handleInputChange}
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Số lượng"
                                            name="quantity"
                                            value={formValues.quantity}
                                            onChange={handleInputChange}
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth required>
                                            <InputLabel>Danh mục</InputLabel>
                                            <Select
                                                value={selectedCategory}
                                                label="Danh mục"
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                            >
                                                {Object.entries(categoryMap).map(([id, name]) => (
                                                    <MenuItem key={id} value={id}>{name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Giới thiệu"
                                            name="description"
                                            value={formValues.description}
                                            onChange={handleInputChange}
                                            fullWidth
                                            multiline
                                            minRows={3}
                                            required
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </DialogContent>
                <DialogActions>
                    <Button onClick={loading ? undefined : onClose}>Hủy</Button>
                    <Button type="submit" variant="contained">Lưu</Button>
                </DialogActions>
                {loading && <Loader/>}
            </form>
        </Dialog>
    );
};

export default EditProductForm;
