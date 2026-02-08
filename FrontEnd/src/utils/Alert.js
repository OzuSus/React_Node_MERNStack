import Swal from "sweetalert2";

export const showConfirmDialog = async (title = "Bạn chắc chắn chứ?", icon = "question") => {
    return await Swal.fire({
        title,
        icon,
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Hủy",
        customClass: {
            popup: 'my-swal-popup',
            title: 'my-swal-title',
            confirmButton: 'my-swal-confirm',
        },
        background: '#f0f9ff',
        color: '#1d3557',
    });
};

export const showSuccessDialog = async (title = "Thành công", text = "") => {
    return await Swal.fire({
        title,
        text,
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
            popup: 'my-swal-popup',
            title: 'my-swal-title',
            confirmButton: 'my-swal-confirm',
        },
        background: '#f0f9ff',
        color: '#1d3557',
    });
};

export const showErrorDialog = async (title = "Lỗi", text = "") => {
    return await Swal.fire({
        title,
        text,
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
            popup: 'my-swal-popup',
            title: 'my-swal-title',
            confirmButton: 'my-swal-confirm',
        },
        background: '#f0f9ff',
        color: '#1d3557',
    });
};

export const showLoginRequiredDialog = async () => {
    return await Swal.fire({
        title: "Thông báo",
        text: "Vui lòng đăng nhập để thực hiện dịch vụ",
        icon: "warning",
        confirmButtonText: "OK",
        customClass: {
            popup: 'my-swal-popup',
            title: 'my-swal-title',
            confirmButton: 'my-swal-confirm',
        },
        background: '#f0f9ff',
        color: '#1d3557',
    });
};
