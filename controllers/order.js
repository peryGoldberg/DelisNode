

import { Order, orderValidator } from "../modells/order.js";
import mongoose from "mongoose";

export const getAllorders = async (req, res) => {
    try {
        let orders = await Order.find();
        res.json(orders);
    }
    catch (err) {
        res.status(500).send("cannot find the orders");
    }
}
export const addorder = async (req, res) => {
    try {     
        let newOrder = orderValidator(req.body);
        if (newOrder.error)
            return res.status(401).send("invalid details");
            const existingOrders = await Order.find({ date: req.body.date });
            if (existingOrders.length > 0) {
                return res.status(409).send("Appointment is not available"); // קוד סטטוס 409 עבור קונפליקט
            }
    
                newOrder = await Order.create(req.body);     
                res.json(newOrder);
            
    }         
    catch (err) {
        res.status(500).send("cannot find add order");
    }
}
export const deleteorderById = async (req, res) => {
    let { id } = req.params;
    if (!mongoose.isValidObjectId(id))
        return res.status(400).send("invalid id");
    try {
        let deletOrder = await Order.findByIdAndDelete({ _id: id })
        if (!deletOrder)
            return res.status(400).send("this id isnot exist")
        res.json(deletOrder);
    }
    catch (err) {
        res.status(500).send("cannot delet this order");
    }
}
export const getAllOrderByUserId = async (req, res) => {
    try {
        let { _id } = req.user;
        let allOrders = await Order.find({ userId: _id });
        if (!allOrders)
            res.status(400).send("their user has no orders");
        res.json(allOrders);
    }
    catch (err) {
        res.status(500).send("cannot get the orders");
    }
}
export const updateorderSetOff = async (req, res) => {
    let {id }= req.params;
    if (!mongoose.isValidObjectId(id))
        return res.status(400).send("invalid id");
    try {
        let update = await Order.findById(id);
        if(!update)
        return  res.status(400).send("this order id is not definded");
        let updateOrder = await Order.findByIdAndUpdate({ _id: id }, { isSetOff: true },{new:true})
        res.json(updateOrder);

    }
    catch (err) {
        res.status(500).send("cannot update");
    }
}
