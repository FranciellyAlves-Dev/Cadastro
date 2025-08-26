import { useEffect, useState } from "react";
import { listClientes, createCliente, cep, type Cliente } from "./lib/api";

function App() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [tipo, setTipo] = useState<"CPF" | "CNPJ">("CPF");
  const [cpf, setCpf] = useState("");
  const [cnpj, setCnpj] = useState("");

  const [cepValue, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");

  
  useEffect(() => {
    listClientes({}).then(setClientes);
  }, []);

  const buscarCep = async () => {
    if (cepValue.length === 8) {
      const endereco = await cep(cepValue);
      setRua(endereco.logradouro || "");
      setBairro(endereco.bairro || "");
      setCidade(endereco.localidade || "");
    }
  };

  const salvarCliente = async () => {
    const novo = await createCliente({
      nome,
      email,
      whatsapp,
      tipo,
      cpf: tipo === "CPF" ? cpf : null,
      cnpj: tipo === "CNPJ" ? cnpj : null,
      enderecos: [
        {
          cep: cepValue,
          rua,
          bairro,
          cidade,
          id: 0,
          clienteId: 0,
          createdAt: ""
        },
      ],
    });

    setClientes([...clientes, novo]);
    setNome("");
    setEmail("");
    setWhatsapp("");
    setCpf("");
    setCnpj("");
    setCep("");
    setRua("");
    setBairro("");
    setCidade("");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Cadastro de Clientes</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Whatsapp"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />

        <select value={tipo} onChange={(e) => setTipo(e.target.value as any)}>
          <option value="CPF">CPF</option>
          <option value="CNPJ">CNPJ</option>
        </select>

        {tipo === "CPF" && (
          <input
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
        )}
        {tipo === "CNPJ" && (
          <input
            placeholder="CNPJ"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
          />
        )}

        <input
          placeholder="CEP"
          value={cepValue}
          onChange={(e) => setCep(e.target.value)}
          onBlur={buscarCep}
        />
        <input
          placeholder="Rua"
          value={rua}
          onChange={(e) => setRua(e.target.value)}
        />
        <input
          placeholder="Bairro"
          value={bairro}
          onChange={(e) => setBairro(e.target.value)}
        />
        <input
          placeholder="Cidade"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
        />

        <button onClick={salvarCliente}>Salvar Cliente</button>
      </div>

      <h2>Lista de Clientes</h2>
      <ul>
        {clientes.map((c) => (
          <li key={c.id}>
            {c.nome} - {c.email} - {c.tipo}  
            <br />
            Endereço: {c.enderecos?.[0]?.rua}, {c.enderecos?.[0]?.bairro},{" "}
            {c.enderecos?.[0]?.cidade}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;