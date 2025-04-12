import { Router } from "express";
import { BoletoController } from "../controllers/BoletoController";
import { uploadMiddleware } from "../middlewares/upload";

const router = Router()
const controller = new BoletoController()

router.get("/", controller.buscar)
router.post("/", controller.criar)
router.post("/csv", uploadMiddleware, controller.importarCsv)
router.post("/pdf", uploadMiddleware, controller.separarPdf)

export default router
