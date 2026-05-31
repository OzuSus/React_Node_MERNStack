import React, {useContext} from 'react';
import {
    Dialog, DialogTitle, DialogContent,
    Typography, Grid, Table, TableHead, TableRow,
    TableCell, TableBody, TableContainer, Paper
} from '@mui/material';
import {CategoryContext} from "../context/CategoryContext";

const OrderDetailModal = ({open, onClose, order}) => {
    const {categoryMap} = useContext(CategoryContext);

    if (!order) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    backgroundColor: '#f9f9f9',
                    boxShadow: '0px 5px 20px rgba(0,0,0,0.2)',
                    p: 2,
                },
            }}
        >
            <DialogTitle
                sx={{
                    fontWeight: 'bold',
                    fontSize: 20,
                    color: '#3f51b5',
                    borderBottom: '1px solid #ddd',
                    mb: 1,
                }}
            >
                Chi tiết đơn hàng #{order.idOrder}
            </DialogTitle>

            <DialogContent dividers sx={{pt: 2}}>
                {/* Thông tin vận chuyển */}
                <Typography variant="h6" sx={{color: '#2e7d32', mb: 2}}>
                    Thông tin vận chuyển
                </Typography>

                <Grid container spacing={2} sx={{mb: 3}}>
                    <Grid item xs={6}><strong>Họ tên:</strong> {order.fullname}</Grid>
                    <Grid item xs={6}><strong>Email:</strong> {order.email}</Grid>
                    <Grid item xs={6}><strong>Địa chỉ:</strong> {order.address}</Grid>
                    <Grid item xs={6}><strong>Số điện thoại:</strong> {order.phone}</Grid>
                </Grid>

                {/* Chi tiết sản phẩm */}
                <Typography variant="h6" sx={{color: '#1976d2', mb: 2}}>
                    Chi tiết sản phẩm
                </Typography>

                <TableContainer component={Paper} elevation={2} sx={{borderRadius: 2}}>
                    <Table size="small">
                        <TableHead sx={{backgroundColor: '#f1f1f1'}}>
                            <TableRow>
                                <TableCell><strong>Tên sản phẩm</strong></TableCell>
                                <TableCell><strong>Danh mục</strong></TableCell>
                                <TableCell><strong>Số lượng</strong></TableCell>
                                <TableCell><strong>Giá</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {order.orderDetails.map((detail) => (
                                <TableRow key={detail.id}>
                                    <TableCell>{detail.product.name}</TableCell>
                                    <TableCell>
                                        {categoryMap[detail.product.categoryID] || "Không xác định"}
                                    </TableCell>
                                    <TableCell>{detail.quantity}</TableCell>
                                    <TableCell>{detail.price.toLocaleString()} đ</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
        </Dialog>
    );
};

export default OrderDetailModal;