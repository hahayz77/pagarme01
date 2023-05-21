import Cart from "../models/Cart.js";

class CartsController {
    async index(req, res) {
        try {
            const carts = await Cart.find();
            return res.status(200).json(carts)
        } catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    }

    async create(req,res){
        try {
            const {code, price} = req.body;

            const cart = await Cart.create({code, price})
            return res.status(201).json(cart)

        } catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    }
}

export default new CartsController();