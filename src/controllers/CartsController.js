class CartsController {
    async index(req, res) {
        return res.status(200).json({ hello: "cartRoute" })
    }
}

export default new CartsController();