import React, {createContext, useContext, useEffect, useState} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {showConfirmDialog, showErrorDialog, showSuccessDialog} from "../utils/Alert";
import {useNavigate} from "react-router-dom";


export const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
    const [deliveryMethods, setDeliveryMethods] = useState([]);
    const [isLoadingDeliveryMethods, setIsLoadingDeliveryMethods] = useState(true);
    const [paymentMethods, setPaymentMethods] = useState([]);
    // const navigate = useNavigate();

    const fetchPaymentMethods = async () => {
        try {
            const response = await axios.get("http://localhost:5000/paymentMethods");
            setPaymentMethods(response.data.paymentMethods);
        }catch (error) {
            console.error("Lỗi khi lấy phương thức thanh toán:", error);
        }finally {
            setIsLoadingDeliveryMethods(false);
        }
    }

    useEffect(() => {
        const fetchDeliveryMethods = async () => {
            try {
                const response = await axios.get("http://localhost:5000/deliveryMethods");
                setDeliveryMethods(response.data.deliveryMethods);
            } catch (error) {
                console.error("Lỗi khi lấy phương thức giao hàng:", error);
            } finally {
                setIsLoadingDeliveryMethods(false);
            }
        };
        fetchDeliveryMethods();
        fetchPaymentMethods();
    }, []);



    const handlePlaceOrder = async (payload) => {
        try {

            const response = await axios.post("http://localhost:5000/orders/place", payload, {
                withCredentials: true,

            });
            if (response.status === 200) {
                // await Swal.fire("Đặt hàng thành công", "Cảm ơn bạn đã mua hàng!", "success");
                return true;
            } else {
                await Swal.fire("Lỗi", "Đặt hàng không thành công.", "error");
                return false;
            }
        } catch (error) {
            console.error("Lỗi đặt hàng:", error);
            await Swal.fire("Lỗi", "Đã xảy ra lỗi trong quá trình đặt hàng.", "error");
            return false;
        }
    };


    const createVnpayPayment = async (amount, content) => {
        try {
            const response = await axios.post("http://localhost:8080/api/vnpay/create-payment", {
                amount: amount,
                content: content
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            return response.data;
        } catch (error) {
            await showErrorDialog("Lỗi", "Không thể tạo liên kết thanh toán VNPay.")
            return null;
        }
    };


    return (
        <CheckoutContext.Provider value={{deliveryMethods, isLoadingDeliveryMethods, handlePlaceOrder, createVnpayPayment, paymentMethods, fetchPaymentMethods}}>
            {children}
        </CheckoutContext.Provider>
    );
};