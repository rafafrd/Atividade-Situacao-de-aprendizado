import { Router } from "express";
import fornecedoresRouter from "./fornecedores.routes";
import categoriaRouter from "./categoria.routes";
import estoqueRouter from "./estoque.routes";
const router = Router();

router.use("/fornecedores", fornecedoresRouter);
router.use("/categoria", categoriaRouter);
router.use("/estoque", estoqueRouter);

export default router;