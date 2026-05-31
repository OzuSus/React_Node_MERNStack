import {useAdminProduct} from "../context/AdminProductsContext";
import React, {useContext, useState} from "react";
import {CategoryContext} from "../context/CategoryContext";
import {
    Alert,
    Box, Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel, MenuItem,
    Paper, Select,
    TextField,
    Typography
} from "@mui/material";
import {UserContext} from "../context/UserContext";
import axios from "axios";

import FormHelperText from '@mui/material/FormHelperText';
import {showErrorDialog, showSuccessDialog} from "../utils/Alert";

const AddJewelerResponse = ({ open, onClose, selectedReqId }) => {
    const { user } = useContext(UserContext); // có jewelerId từ context
    const { categoryList } = useContext(CategoryContext);

    const [previewImage, setPreviewImage] = useState('');
    const [productImage, setProductImage] = useState(null);
    const [error, setError] = useState('');
    const [touchedFields, setTouchedFields] = useState({});
    const [formErrors, setFormErrors] = useState({});


    const [formValues, setFormValues] = useState({
        name: '',
        proposedPrice: '',
        description: '',
        categoryId: '',
    });

    const handleChangePrice = (e) => {
        const { name, value } = e.target;
        const trimmedValue = typeof value === 'string' ? value.trim() : value;
        setTouchedFields(prev => ({ ...prev, [name]: true }));
        let errorMessage = '';
        switch (name) {
            case 'proposedPrice':
                if (trimmedValue !== "" && !/^\d+$/.test(trimmedValue)) {
                    errorMessage = "Giá phải là số nguyên dương.";
                }
                break;
            case 'name':
            case 'description':
            case 'categoryId':
                if (!trimmedValue) {
                    errorMessage = `Vui lòng nhập trường ${name === 'categoryId' ? 'danh mục' : name}.`;
                }
                break;
            default:
                break;
        }
        setError(errorMessage);
        setFormValues(prev => ({ ...prev, [name]: trimmedValue }));
    };
    const handleChange = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProductImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, proposedPrice, description, categoryId } = formValues;
        setError("")

        if (!name || !proposedPrice || !description || !categoryId) {
            setError("Vui lòng điền đầy đủ tất cả các trường.");
            return;
        }
        if (!categoryId) {
            setError("Vui lòng chọn danh mục.");
            return;
        }
        if (!productImage) {
            setError("Vui lòng chọn ảnh sản phẩm.");
            return;
        }
        if (!/^\d+$/.test(proposedPrice) ) {
            setError("Giá phải là số nguyên dương.");
            return;
        }

        const formData = new FormData();
        formData.append('customerRequestId', selectedReqId);
        formData.append('jewelerId', user?.id);
        formData.append('name', name);
        formData.append('proposedPrice', proposedPrice);
        formData.append('description', description);
        formData.append('categoryId', categoryId);
        formData.append('image', productImage);

        try {
            await axios.post("http://localhost:8080/api/jeweler-response/create", formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            showSuccessDialog("Thành công", "Gửi yêu cầu phản hồi thành công!")
            setError("");
            handleClose();
        } catch (error) {
            const apiErrorMessage = error.response?.data;
            setError(apiErrorMessage);
            console.error("❌ Lỗi khi gửi phản hồi:", apiErrorMessage);
        }

    };

    const handleClose = () => {
        setError("");
        setPreviewImage('');
        setProductImage(null);
        setTouchedFields({});
        setFormValues({
            name: '',
            proposedPrice: '',
            description: '',
            categoryId: '',
        });
        onClose();
    };
    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold' }}>
                Thêm Phản hồi mới
            </DialogTitle>
            <form onSubmit={handleSubmit} >
                <DialogContent>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={5}>
                                {/* Ảnh */}
                                <Box
                                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
                                >
                                    <Box
                                        onClick={() => document.getElementById("product-image-input").click()}
                                        sx={{
                                            width: '100%',
                                            position: 'relative',
                                            paddingTop: '100%',
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
                                        style={{ display: 'none' }}
                                        // required
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={7}>
                                {/* Form Fields */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <TextField
                                        autoFocus
                                        label="🎯 Tiêu đề yêu cầu"
                                        name="name"
                                        value={formValues.name}
                                        onChange={handleChange}
                                        fullWidth
                                    />

                                    <TextField
                                        label="🔽 Giá đề xuất"
                                        name="proposedPrice"
                                        inputMode="numeric"
                                        value={formValues.proposedPrice}
                                        onChange={handleChangePrice}
                                        fullWidth
                                    />

                                    <FormControl fullWidth >
                                        <InputLabel id="category-label">🏷 Danh mục</InputLabel>
                                        <Select
                                            labelId="category-label"
                                            name="categoryId"
                                            value={formValues.categoryId}
                                            label="🏷 Danh mục"
                                            onChange={handleChange}
                                        >
                                            {categoryList.map(cat => (
                                                <MenuItem key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {formErrors.categoryId && <FormHelperText>{formErrors.categoryId}</FormHelperText>}
                                    </FormControl>

                                    <TextField
                                        label="📝 Mô tả chi tiết"
                                        name="description"
                                        value={formValues.description}
                                        multiline
                                        rows={2}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                    {error && (
                                        <Alert severity="error" sx={{ fontWeight: 'medium' }}>
                                            {error}
                                        </Alert>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Hủy</Button>
                    <Button type="submit" variant="contained" color="primary">Lưu</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddJewelerResponse;