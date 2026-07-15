import express from "express";
import { soldierRepo } from "../data/repository.js";
import { soldierSchema, soldierUpdateSchema } from "../utils/validation.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const validation = soldierSchema.partial().safeParse(req.query);
  if (!validation.success) {
    const errorDetails = JSON.stringify(validation.error.flatten().fieldErrors)
    const err = new Error(`Invalid query - ${errorDetails}`);
    err.statusCode = 400;
    return next(err);
  }
  const soldiers = await soldierRepo.find(req.query);
  return res.json({
    success: true,
    data: soldiers,
  });
});

router.post("/", async (req, res, next) => {
  const validation = soldierSchema.safeParse(req.body);
  if (!validation.success) {
    const errorDetails = JSON.stringify(validation.error.flatten().fieldErrors)
    const err = new Error(`Invalid body - ${errorDetails}`);
    err.statusCode = 422;
    return next(err);
  }
  const soldierId = await soldierRepo.createItem(req.body);
  return res.status(201).json({
    success: true,
    data: `Soldier (${soldierId}) created successfully.`,
  });
});

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  if (isNaN(id)) {
    const err = new Error("ID must be a number.");
    err.statusCode = 400;
    return next(err);
  }
  const soldier = await soldierRepo.getById(Number(id));
  if (!soldier) {
    const err = new Error("Soldier not found");
    err.statusCode = 404;
    return next(err);
  }
  return res.json({
    success: true,
    data: soldier,
  });
});

router.put("/:id", async (req, res, next) => {
  const id = req.params.id;
  if (isNaN(id)) {
    const err = new Error("ID must be a number.");
    err.statusCode = 400;
    return next(err);
  }

  const validation = soldierUpdateSchema.safeParse(req.body);
  if (!validation.success) {
    const errorDetails = JSON.stringify(validation.error.flatten().fieldErrors)
    const err = new Error(`Invalid body - ${errorDetails}`);
    err.statusCode = 422;
    return next(err);
  }
  const updated = await soldierRepo.updateItem(id, req.body);
  if (!updated) {
    throw new Error();
  }
  return res.json({
    success: true,
    data: `Soldier (${id} updated successfully.)`,
  });
});

router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  if (isNaN(id)) {
    const err = new Error("ID must be a number.");
    err.statusCode = 400;
    return next(err);
  }

  const deleted = await soldierRepo.deleteItem(id);
  if (!deleted) {
    const err = new Error("Soldier not found.");
    err.statusCode = 404;
    return next(err);
  }
  return res.json({
    success: true,
    data: `Soldier (${id}) deleted successfully.`,
  });
});

router.patch("/:id/status", async (req, res, next) => {
  const id = req.params.id;
  if (isNaN(id)) {
    const err = new Error("ID must be a number.");
    err.statusCode = 400;
    return next(err);
  }
  const reqKeys = Object.keys(req.body)
  if (reqKeys.length !== 0 && reqKeys[0] !== "status") {
    const err = new Error("Key must be 'status'.");
    err.statusCode = 400;
    return next(err);
  }
  const updated = await soldierRepo.updateStatus(id, req.body.status);
  if (!updated) throw new Error();
  return res.json({
    success: true,
    data: `Soldier (${id} status changed to - ${req.body.status})`,
  });
});

export default router;
