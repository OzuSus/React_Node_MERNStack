import React, {useContext, useEffect, useState} from "react";
import {
    Grid,
    Typography,
    Card,
    Box,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer, Button, Chip,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import PeopleIcon from "@mui/icons-material/People";
import PageviewIcon from "@mui/icons-material/Pageview";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PageTitle from "../../../components/Typography/PageTitle";
import OrdersTable from "../../../components/OrdersTable";
import {CategoryPieChart, MonthlyRevenueChart} from "../../../components/Chart";
import {UserContext} from "../../../context/UserContext";
import {OrderContext} from "../../../context/OrderContext";
import axios from "axios";
import {AccessTime, FlashOn, LocalShipping, MonetizationOn, Payments} from "@mui/icons-material";

const InfoCard = ({ icon: Icon, title, value, gradientFrom, gradientTo, iconColor = "#fff" }) => {
    return (
        <Card elevation={4} sx={{display: "flex", alignItems: "center", p: 3, borderRadius: 3, background: "linear-gradient(to right, #fdfbfb, #ebedee)", backgroundImage: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`, color: "#fff", boxShadow: "0 8px 16px rgba(0,0,0,0.1)",}}>
            <Box sx={{width: 60, height: 60, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", mr: 3,}}>
                <Icon sx={{ fontSize: 30, color: iconColor }} />
            </Box>
            <Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {title}
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                    {value}
                </Typography>
            </Box>
        </Card>
    );
};
const ChartCard = ({ title, children }) => (
  <Paper elevation={3} sx={{ p: 2 }}>
    <Typography variant="subtitle1" sx={{ mb: 2 }}>
      {title}
    </Typography>
    {children}
  </Paper>
);

const Dashboard = () => {
    const {allUser, getAllUser} = useContext(UserContext);
    const {allOrdes, getAllOrders, allProducts, getAllProducts, totalRevenue, getTotalRevenue, completedOrders, getcompletedOrders} = useContext(OrderContext);
    useEffect(() => {
        getAllUser();
        getAllOrders();
        getAllProducts();
        getTotalRevenue();
        getcompletedOrders();
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = completedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.max(1, Math.ceil(completedOrders.length / ordersPerPage));

    const getStatusChip = (id, name) => {
        const statusMap = {
            5: { label: "Chưa xác nhận", color: "#ff9800" },
            6: { label: "Đã xác nhận", color: "#2196f3" },
            7: { label: "Đang vận chuyển", color: "#9c27b0" },
            8: { label: "Đã giao hàng", color: "#4caf50" },
            9: { label: "Đã hủy", color: "#f44336" },
        };
        const status = statusMap[id] || { label: name, color: "#9e9e9e" };
        return <Chip label={status.label} sx={{ backgroundColor: status.color, color: 'white', fontWeight: 'bold' }} />;
    };

    const renderPaymentMethod = (method) => {
        if (!method) return null;
        switch (method.id) {
            case 1:
                return <Chip icon={<MonetizationOn fontSize="small"/>} label="COD" sx={{ backgroundColor: "#ffcc80", fontWeight: 'bold' }} />;
            case 3:
                return <Chip icon={<Payments fontSize="small"/>} label="VNPAY" sx={{ backgroundColor: "#80deea", fontWeight: 'bold' }} />;
            default:
                return <Chip label={method.type_payment} sx={{ backgroundColor: "#e0e0e0" }} />;
        }
    };

    const renderDeliveryMethod = (method) => {
        if (!method) return null;
        switch (method.id) {
            case 1:
                return <Chip icon={<AccessTime fontSize="small"/>} label="Tiết kiệm" sx={{ backgroundColor: "#c5e1a5", fontWeight: 'bold' }} />;
            case 2:
                return <Chip icon={<LocalShipping fontSize="small" />} label="Nhanh" sx={{ backgroundColor: "#81d5d2", fontWeight: 'bold' }} />;
            case 3:
                return <Chip icon={<FlashOn fontSize="small"/>} label="Hỏa tốc" sx={{ backgroundColor: "#ff8a65", fontWeight: 'bold' }} />;
            default:
                return <Chip label={method.name} sx={{ backgroundColor: "#e0e0e0" }} />;
        }
    };

    return (
        <Box sx={{p: 3}}>
            <PageTitle>Dashboard</PageTitle>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <InfoCard
                        title="Số lượng user"
                        value={allUser.length}
                        gradientFrom="#667eea"
                        gradientTo="#764ba2"
                        icon={PeopleIcon}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <InfoCard
                        title="Tổng doanh thu"
                        value={totalRevenue !== undefined && totalRevenue !== null ? totalRevenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : ''}
                        gradientFrom="#43cea2"
                        gradientTo="#185a9d"
                        icon={TrendingUpIcon}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <InfoCard
                        title="Số đơn hàng"
                        value={allOrdes.length}
                        gradientFrom="#f7971e"
                        gradientTo="#ffd200"
                        icon={InsertChartIcon}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <InfoCard
                        title="Số sản phẩm"
                        value={allProducts.length}
                        gradientFrom="#fc4a1a"
                        gradientTo="#f7b733"
                        icon={ShoppingBagIcon}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{mt: 1}}>
                <Grid item xs={12} md={7}>
                    <ChartCard title="Biểu đồ thống kê doanh thu">
                        <MonthlyRevenueChart/>
                    </ChartCard>
                </Grid>
                <Grid item xs={12} md={5}>
                    <ChartCard title="Thống kê số lượng phân loại sản phẩm đã bán">
                        <CategoryPieChart/>
                    </ChartCard>
                </Grid>
            </Grid>

            <Box sx={{ mt: 5, p: 3, backgroundColor: "#fafafa", borderRadius: 3, boxShadow: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#37474f', mb: 2 }}>
                    📦 Danh sách đơn hàng
                </Typography>
                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#1565c0' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Mã đơn hàng</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Khách hàng</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Thanh toán</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Vận chuyển</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tổng giá</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Trạng thái</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ngày đặt</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentOrders.map((order) => (
                                <TableRow key={order.idOrder} hover>
                                    <TableCell sx={{ fontWeight: 'bold' }}>#{order.idOrder}</TableCell>
                                    <TableCell>{order.fullname}</TableCell>
                                    <TableCell>{renderPaymentMethod(order.paymentMethod)}</TableCell>
                                    <TableCell>{renderDeliveryMethod(order.deliveryMethop)}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                                        {order.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                    </TableCell>
                                    <TableCell>{getStatusChip(order.status?.id, order.status?.name)}</TableCell>
                                    <TableCell>{order.dateOrder}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ display: "flex", justifyContent: "center", alignItems: 'center', mt: 4, gap: 3 }}>
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

                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 100 }}>
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

            </Box>

        </Box>
    );
};

export default Dashboard;
