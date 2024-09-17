
import { BD, BDValidator } from "../modells/BD.js";
import mongoose from "mongoose";

export const getAllBD = async (req, res) => {
    try {
        let bd = await BD.find();
        res.json(bd);
    }
    catch (err) {
        res.status(500).send("cannot find the orders");
    }
}
export const addBD = async (req, res) => {
    try {     
        let newOrder = BDValidator(req.body);
        if (newOrder.error)
            return res.status(401).send("invalid details");
        newOrder = await BD.create(req.body);     
        res.json(newOrder);
    }         
    catch (err) {
        res.status(500).send("cannot find add order");
    }
}
export const deleteBDById = async (req, res) => {
    let { id } = req.params;
    if (!mongoose.isValidObjectId(id))
        return res.status(400).send("invalid id");
    try {
        let deletOrder = await BD.findByIdAndDelete({ _id: id })
        if (!deletOrder)
            return res.status(400).send("this id isnot exist")
        res.json(deletOrder);
    }
    catch (err) {
        res.status(500).send("cannot delet this order");
    }
}

export const updateBDSetOff = async (req, res) => {
   
    try {
        const business = await BD.findOne(); 
        if (!business) {
            return res.status(400).send("invalid");
        }
        let validate = BDValidator(req.body);
        // if (validate.error)
        //     return res.status(403).send("error in params");
        let { img, phone, logo, businessName,address } = req.body;
        business.logo = logo || business.logo;
        business.phone = phone || business.phone;
        business.businessName = businessName || business.businessName;
        business.img = img || business.img;
        business.address = address || business.address;
        await business.save();
        res.json(business);

    }
    catch (err) {
        res.status(500).send("cannot update");
    }
}
