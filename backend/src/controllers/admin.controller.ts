import { Request, Response } from "express";
import * as adminService from "../services/admin.service";

export async function createEmployee(req: Request, res: Response) {
  const employee = await adminService.createEmployee(req.body);
  res.status(201).json({ success: true, employee });
}

export async function listEmployees(_req: Request, res: Response) {
  const employees = await adminService.listEmployees();
  res.json({ success: true, employees });
}


