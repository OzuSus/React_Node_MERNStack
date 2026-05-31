import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl
} from "@mui/material";
import {useState, useContext, useEffect} from "react";
import {PurchaseHistoryContext} from "../context/PurchaseHistoryContext";
import {OrderContext} from "../context/OrderContext";
import {showErrorDialog, showSuccessDialog} from "../utils/Alert";

const UpdateStatusModal = ({open, onClose, order, onSuccess}) => {
    const {allStatuses} = useContext(PurchaseHistoryContext)
    const {handleUpdateStatus} = useContext(OrderContext);

    const [selectedStatus, setSelectedStatus] = useState("");

    const getIdByNameStatus = (nameStatus) => {
        const foundStatus = allStatuses.find((status) => status.name === nameStatus);
        return foundStatus ? foundStatus.id : null;
    };

    const getNameByIdStatus = (idStatus) => {
        const foundStatus = allStatuses.find((status) => status.id === idStatus);
        return foundStatus ? foundStatus.name : "Không rõ";
    };

    // Set selectedStatus khi order hoặc allStatuses thay đổi
    useEffect(() => {
        if (order && allStatuses.length > 0) {
            const name = getNameByIdStatus(order.status.id); // Sử dụng id của status trong order
            setSelectedStatus(name);
        }
    }, [order]);

    const handleUpdate = () => {
        const idStatusSelected = getIdByNameStatus(selectedStatus);

        handleUpdateStatus(order.idOrder, idStatusSelected)
            .then(async () => {
                onClose();
                await showSuccessDialog("Thành công", "Đã thay đổi trạng thái đơn hàng thành công");
                onSuccess(); // để reload lại danh sách order nếu cần
            })
            .catch(async () => {
                onClose();
                await showErrorDialog("Lỗi", "Cập nhật trạng thái đơn hàng thất bại")
            });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Cập nhật trạng thái đơn hàng #{order ? order.idOrder : ""}</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <label style={{marginBottom: '8px', fontWeight: 'bold'}}>
                        Status Order
                    </label>
                    <Select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        {allStatuses.map((s) => (
                            <MenuItem key={s.id} value={s.name}>{s.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                {/*<Button onClick={onClose}>Hủy</Button>*/}
                <Button variant="contained" onClick={handleUpdate}
                        sx={{color: 'green'}}>Lưu</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateStatusModal;