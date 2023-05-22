import { Router } from "express";

import CartsController from "./controllers/CartsController.js"
import TransactionController from "./controllers/TransactionController.js"


const routes = new Router();


routes.get("/carts", CartsController.index)
routes.post("/carts", CartsController.create)
routes.put("/carts/:id", CartsController.update)
routes.delete("/carts/:id", CartsController.delete)

routes.post("/transactions", TransactionController.create)

export default routes;