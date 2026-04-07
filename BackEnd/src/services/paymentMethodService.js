import PaymentMethod from "../models/PaymentMethod.js";

export async function getAllPaymentMethodService() {
    const paymentMethods = await PaymentMethod.find({});
    return paymentMethods;
}