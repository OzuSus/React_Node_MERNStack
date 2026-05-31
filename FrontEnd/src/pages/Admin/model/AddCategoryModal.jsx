import React, {useState} from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
} from "@mui/material";
import {Cancel} from "@mui/icons-material";
import {api} from "../../../utils/api";
import {showErrorDialog, showSuccessDialog} from "../../../utils/Alert";

const AddCategoryModal = ({open, onClose, onAddCategory}) => {
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);

    const resetForm = () => {
        setName("");
        setImage(null);
        setImagePreview("");
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async () => {
        if (!name.trim() || !image) {
            await showErrorDialog("Loi", "Vui long nhap ten va chon anh danh muc.");
            return;
        }

        const formData = new FormData();
        formData.append("name", name.trim());
        formData.append("image", image);
        formData.append("status", "ACTIVE");

        try {
            setLoading(true);
            await api.post("/categories", formData, {
                headers: {"Content-Type": "multipart/form-data"},
            });
            await showSuccessDialog("Thanh cong", "Da them danh muc.");
            onAddCategory();
            handleClose();
        } catch (error) {
            await showErrorDialog("Loi", error.response?.data?.message || "Them danh muc that bai.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={loading ? undefined : handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Them danh muc</DialogTitle>
            <DialogContent>
                <TextField
                    label="Ten danh muc"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{mb: 2, mt: 1}}
                />

                {imagePreview ? (
                    <Box sx={{position: "relative", mb: 2}}>
                        <img
                            src={imagePreview}
                            alt="preview"
                            style={{width: "25%", borderRadius: 8}}
                        />
                        <IconButton
                            onClick={handleRemoveImage}
                            sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                backgroundColor: "white",
                            }}
                        >
                            <Cancel color="error"/>
                        </IconButton>
                    </Box>
                ) : (
                    <Button variant="contained" component="label" sx={{mb: 2}}>
                        Chon anh
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleImageChange}
                        />
                    </Button>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={loading}>Huy</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                    {loading ? "Dang them..." : "Them"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddCategoryModal;
