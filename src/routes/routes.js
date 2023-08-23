import express from "express"
import Cadastro from "../controllers/CadastroController.js";
import Login from "../controllers/LoginController.js";
const routes = express.Router()

routes.post("/cadastro", Cadastro.execute)
routes.post("/login", Login.execute)

export default routes;