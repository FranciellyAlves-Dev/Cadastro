import express from "express";
import clientes from "./routes/clientes";
import enderecos from "./routes/enderecos";
import produtos from "./routes/produtos";

const app = express();
app.use(express.json());

app.get("/", (_req, res) => res.send("API OK"));

app.use("/clientes", clientes);
app.use("/enderecos", enderecos);
app.use("/produtos", produtos);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});