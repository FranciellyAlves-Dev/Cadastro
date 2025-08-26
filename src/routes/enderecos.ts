import { Router } from "express";
import { z } from "zod";
import prisma from "../services/prisma";
import viacep from "../services/viacep";

const router = Router();

const enderecoSchema = z.object({
  clienteId: z.number(),
  cep: z.string().min(8),
  rua: z.string(),
  bairro: z.string(),
  cidade: z.string()
});

router.get("/", async (req, res) => {
  const clienteId = req.query.clienteId ? Number(req.query.clienteId) : undefined;
  const data = await prisma.endereco.findMany({
    where: clienteId ? { clienteId } : undefined,
    orderBy: { id: "desc" }
  });
  res.json(data);
});

router.get("/cep/:cep", async (req, res) => {
  try {
    const cep = req.params.cep.replace(/\D/g, "");
    const data = await viacep(cep);
    if ((data as any).erro) return res.status(404).json({ error: "CEP não encontrado" });
    res.json({
      cep: data.cep,
      rua: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade
    });
  } catch {
    res.status(500).json({ error: "Falha ao consultar ViaCEP" });
  }
});

router.post("/", async (req, res) => {
  const parsed = await enderecoSchema.parseAsync(req.body);
  const created = await prisma.endereco.create({ data: parsed });
  res.status(201).json(created);
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const parsed = await enderecoSchema.partial().parseAsync(req.body);
  const updated = await prisma.endereco.update({ where: { id }, data: parsed });
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.endereco.delete({ where: { id } });
  res.status(204).send();
});

export default router;