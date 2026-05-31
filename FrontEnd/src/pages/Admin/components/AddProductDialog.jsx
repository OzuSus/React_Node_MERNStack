import React, {useContext, useState} from "react";
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

const AddProductForm = ({open, onClose}) => {
    const {loading, addProduct} = useAdminProduct();
    const {categoryMap} = useContext(CategoryContext);

    const [previewImage, setPreviewImage] = useState('');
    const [productImage, setProductImage] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [formValues, setFormValues] = useState({
        productName: '',
        price: '',
        quantity: '',
        description: '',
    });

    const handleChange = (e) => {
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

    const handleClose = () => {
        setPreviewImage('');
        setProductImage(null);
        setSelectedCategory('');
        setFormValues({
            productName: '',
            price: '',
            quantity: '',
            description: '',
        });
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const {productName, price, quantity, description} = formValues;
        addProduct(productName, quantity, price, description, selectedCategory, productImage);

        setPreviewImage('');
        setProductImage(null);
        setSelectedCategory('');
        setFormValues({
            productName: '',
            price: '',
            quantity: '',
            description: '',
        });

        onClose();
    };

    return (
        <Dialog open={open}
                onClose={loading ? undefined : handleClose}
                disableEscapeKeyDown={loading}
                maxWidth="md"
                fullWidth>
            <DialogTitle className="product-dialog__title" sx={{fontWeight: 'bold'}}>
                Thêm sản phẩm mới
            </DialogTitle>
            <form onSubmit={loading ? undefined : handleSubmit}>
                <DialogContent>
                    <Paper elevation={3} sx={{p: 2}}>
                        <Grid container spacing={3}>
                            {/* LEFT SIDE - IMAGE */}
                            {/* LEFT SIDE - IMAGE */}
                            <Grid item xs={12} md={5}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 2
                                    }}
                                >
                                    {/*<Typography variant="subtitle1" fontWeight="bold">*/}
                                    {/*    Ảnh sản phẩm*/}
                                    {/*</Typography>*/}

                                    <Box
                                        onClick={() => document.getElementById("product-image-input").click()}
                                        sx={{
                                            width: '100%',
                                            position: 'relative',
                                            paddingTop: '100%', // Tạo khung vuông
                                            border: '2px dashed #ccc',
                                            borderRadius: 2,
                                            cursor: 'pointer',
                                            backgroundColor: '#f9f9f9',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {previewImage ? (
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    backgroundImage: `url(${previewImage})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                }}
                                            />
                                        ) : (
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    color: '#888',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                Nhấn để chọn ảnh
                                            </Typography>
                                        )}
                                    </Box>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="product-image-input"
                                        onChange={handleImageChange}
                                        style={{display: 'none'}}
                                        required
                                    />
                                </Box>
                            </Grid>


                            {/* RIGHT SIDE - FORM FIELDS */}
                            <Grid item xs={12} md={7}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Tên sản phẩm"
                                            name="productName"
                                            value={formValues.productName}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Giá"
                                            name="price"
                                            value={formValues.price}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Số lượng"
                                            name="quantity"
                                            value={formValues.quantity}
                                            onChange={handleChange}
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
                                            onChange={handleChange}
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
                    <Button onClick={loading ? undefined : handleClose} color="secondary">Hủy</Button>
                    <Button type="submit" variant="contained" color="primary">Lưu</Button>
                </DialogActions>
                {loading && <Loader/>}
            </form>
        </Dialog>
    );
};

export default AddProductForm;
