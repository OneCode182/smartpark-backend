import { Router } from 'express';

const router = Router();


router.get("/", (req, res) => {
  res.send("🚀 API funcionando correctamente!");
});


export default router;
