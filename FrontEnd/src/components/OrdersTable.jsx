import React, {useState, useEffect, useContext} from "react";
import {
    Avatar,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableFooter,
    Paper,
    TablePagination,
    Typography, IconButton,
} from "@mui/material";

import response from "../utils/demo/ordersData";
import {OrderContext} from "../context/OrderContext";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";

import OrderDetailModal from "./OrderDetailModal";
import UpdateStatusModal from "./UpdateStatusModal";

const getStatusColor = (status) => {
    switch (status) {
        case "Chưa xác nhận":
            return "warning";
        case "Đã xác nhận":
            return "info";
        case "Đang vận chuyển":
            // return "primary";
            return "secondary";
        case "Đã giao hàng":
            return "success";
        case "Đã hủy":
            return "error";
        default:
            return "default";
    }
};

const OrdersTable = ({resultsPerPage = 10, filter = "All"}) => {
    const {fetchOrders, orders} = useContext(OrderContext);
    const [page, setPage] = useState(0);

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openDetailModal, setOpenDetailModal] = useState(false);

    const [showUpdateModal, setShowUpdateModal] = useState(false);

    useEffect(() => {
        setPage(0);
    }, [filter]);

    const filter_Orders = orders.filter(order => {
        // Nếu filter là "All", trả về tất cả đơn hàng
        if (filter === "All") return true;

        // Lọc theo trạng thái đơn hàng (dựa vào order.status.name)
        return order.status?.name === filter;
    });

    const paginatedOrders = filter_Orders.slice(
        page * resultsPerPage,
        page * resultsPerPage + resultsPerPage
    );

    const handleChangePage = (_, newPage) => {
        console.log('newPage', newPage);
        setPage(newPage);
    };

    const handleViewOrder = (orderId) => {
        const order = filter_Orders.find(o => o.idOrder === orderId);
        setSelectedOrder(order);
        setOpenDetailModal(true);
    };

    const handleCloseModal = () => {
        setOpenDetailModal(false);
        setSelectedOrder(null);
    };

    const handleEditOrder = (orderId) => {
        const order = filter_Orders.find(o => o.idOrder === orderId);
        setSelectedOrder(order);
        setShowUpdateModal(true);
    };

    const handleCloseStatusModal = () => {
        setShowUpdateModal(false);
        setSelectedOrder(null);
    };

    return (
        <TableContainer component={Paper} sx={{mb: 4}}>
            <Table>
                <TableHead>
                    <TableRow>
                        {/*<TableCell><b>Client</b></TableCell>*/}
                        <TableCell><b>Order ID</b></TableCell>
                        <TableCell><b>Ngày đặt</b></TableCell>
                        <TableCell><b>Phương thức thanh toán</b></TableCell>
                        <TableCell><b>Status</b></TableCell>
                        <TableCell><b>Phương thức vận chuyển</b></TableCell>
                        <TableCell><b>Tổng giá</b></TableCell>
                        <TableCell><b>Chức năng</b></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paginatedOrders.map((order, i) => (
                        <TableRow key={order.idOrder}>
                            {/*<TableCell>*/}
                            {/*    <div style={{display: "flex", alignItems: "center", gap: 12}}>*/}
                            {/*        /!*<Avatar src={user.avatar} alt={order.fullname} />*!/*/}
                            {/*        <Avatar src={""} alt={order.fullname}/>*/}
                            {/*        <Typography variant="body2">{order.fullname}</Typography>*/}
                            {/*    </div>*/}
                            {/*</TableCell>*/}
                            <TableCell>{order.idOrder}</TableCell>
                            <TableCell>{order.dateOrder}</TableCell>
                            <TableCell>{order.paymentMethod.type_payment}</TableCell>
                            <TableCell>
                                <Chip label={order.status.name} color={getStatusColor(order.status.name)}/>
                            </TableCell>
                            <TableCell>{order.deliveryMethop ? order.deliveryMethop.name : "Ko có"}</TableCell>
                            <TableCell>{order.totalPrice ? order.totalPrice : 0} VND</TableCell>
                            <TableCell>
                                <IconButton
                                    size="small"
                                    onClick={() => handleViewOrder(order.idOrder)}
                                    color="primary"
                                    sx={{mr: 1}}
                                >
                                    <VisibilityIcon fontSize="small"/>
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={() => handleEditOrder(order.idOrder)}
                                    color="secondary"
                                >
                                    <EditIcon fontSize="small"/>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[resultsPerPage]}
                            count={filter_Orders.length}
                            rowsPerPage={resultsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                        />
                    </TableRow>
                </TableFooter>
            </Table>

            <OrderDetailModal
                open={openDetailModal}
                onClose={handleCloseModal}
                order={selectedOrder}
            />

            <UpdateStatusModal
                open={showUpdateModal}
                onClose={handleCloseStatusModal}
                order={selectedOrder}
                onSuccess={() => {
                    // Optionally refetch orders
                    fetchOrders()
                }}
            />
        </TableContainer>
    )
        ;
};

export default OrdersTable;
