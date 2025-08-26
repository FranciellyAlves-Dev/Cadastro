import { Router, Request, Response } from "express";
import { z } from "zod";
import prisma from "../services/prisma";

const router = Router();

const clienteSchema = z.object({
  nome: z.string().min(1),
  email: z.string().email(),
  whatsapp: z.string().optional(),
  tipo: z.enum(["CPF", "CNPJ"]),
  cpf: z.string().optional(),
  cnpj: z.string().optional()
}).superRefine((data, ctx) => {
  if (data.tipo === "CPF" && !data.cpf) ctx.addIssue({ code: "custom", path: ["cpf"], message: "CPF é obrigatório" });
  if (data.tipo === "CNPJ" && !data.cnpj) ctx.addIssue({ code: "custom", path: ["cnpj"], message: "CNPJ é obrigatório" });
});

router.get("/", async (req: Request, res: Response) => {
  const { q, start, end } = req.query as { q?: string; start?: string; end?: string };
  const where: any = {};
  if (q) where.OR = [
    { nome: { contains: q, mode: "insensitive" } },
    { email: { contains: q, mode: "insensitive" } }
  ];
  if (start || end) where.createdAt = {
    gte: start ? new Date(start) : undefined,
    lte: end ? new Date(end) : undefined
  };

  const data = await prisma.cliente.findMany({
    where,
    include: { enderecos: true },
    orderBy: { createdAt: "desc" }
  });
  res.json(data);
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const data = await prisma.cliente.findUnique({ where: { id }, include: { enderecos: true } });
  if (!data) return res.status(404).json({ error: "Cliente não encontrado" });
  res.json(data);
});

router.post("/", async (req, res) => {
  const parsed = await clienteSchema.parseAsync(req.body);
  const created = await prisma.cliente.create({ data: parsed });
  res.status(201).json(created);
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const parsed = await clienteSchema.partial().parseAsync(req.body);
  const updated = await prisma.cliente.update({ where: { id }, data: parsed });
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.endereco.deleteMany({ where: { clienteId: id } });
  await prisma.cliente.delete({ where: { id } });
  res.status(204).send();
});

export default router;