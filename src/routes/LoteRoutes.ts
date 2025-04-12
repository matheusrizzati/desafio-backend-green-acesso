import { Router } from "express";
import { LoteController } from "../controllers/LoteController";

const router = Router()
const controller = new LoteController()

router.get("/", controller.buscarTodos)
router.post("/", controller.criar)

export default router
