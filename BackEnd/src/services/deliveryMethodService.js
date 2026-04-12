import DeliveryMethod from "../models/DeliveryMethod.js";

export async function createNewDeliveryMethodService(formData) {
   const newDeliveryMethod  = await DeliveryMethod.create(formData);
   return newDeliveryMethod;
}

export async function getAllDeliveryMethodService() {
    const deliveryMethods = await DeliveryMethod.find({});
    return deliveryMethods;
}