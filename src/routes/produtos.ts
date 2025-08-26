import { Router, Request, Response } from "express";

type Produto = {
  id: number;
  nome: string;
  preco: number;
};

let produtos: Produto[] = [];
let seq = 1;

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json(produtos);
});

router.get("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const produto = produtos.find(p => p.id === id);
  if (!produto) return res.status(404).json({ error: "Produto não encontrado" });
  res.json(produto);
});

router.post("/", (req: Request, res: Response) => {
  const { nome, preco } = req.body as Partial<Produto>;

  if (!nome || typeof nome !== "string") {
    return res.status(400).json({ error: "Campo 'nome' é obrigatório" });
  }
  const precoNum = Number(preco);
  if (Number.isNaN(precoNum) || precoNum < 0) {
    return res.status(400).json({ error: "Campo 'preco' inválido" });
  }

  const novo: Produto = { id: seq++, nome: nome.trim(), preco: precoNum };
  produtos.push(novo);
  res.status(201).json(novo);
});

router.put("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const produto = produtos.find(p => p.id === id);
  if (!produto) return res.status(404).json({ error: "Produto não encontrado" });

  const { nome, preco } = req.body as Partial<Produto>;

  if (nome !== undefined) {
    if (typeof nome !== "string" || !nome.trim()) {
      return res.status(400).json({ error: "Campo 'nome' inválido" });
    }
    produto.nome = nome.trim();
  }

  if (preco !== undefined) {
    const precoNum = Number(preco);
    if (Number.isNaN(precoNum) || precoNum < 0) {
      return res.status(400).json({ error: "Campo 'preco' inválido" });
    }
    produto.preco = precoNum;
  }

  res.json(produto);
});

router.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const idx = produtos.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: "Produto não encontrado" });
  produtos.splice(idx, 1);
  res.status(204).send();
});

export default router;