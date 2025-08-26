const API = "http://localhost:3000";

export type Endereco = {
  id: number;
  cep: string;
  rua: string;
  bairro: string;
  cidade: string;
  clienteId: number;
  createdAt: string;
};

export type Cliente = {
  id: number;
  nome: string;
  email: string;
  whatsapp?: string | null;
  tipo: "CPF" | "CNPJ";
  cpf?: string | null;
  cnpj?: string | null;
  createdAt: string;
  enderecos?: Endereco[];
};

export async function listClientes(params: Record<string, string | number>) {
  const query = new URLSearchParams(params as any).toString();
  const res = await fetch(`${API}/clientes?${query}`);
  return res.json() as Promise<Cliente[]>; 
}

export async function createCliente(payload: Partial<Cliente>) {
  const res = await fetch(`${API}/clientes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", 
    } as HeadersInit, 
    body: JSON.stringify(payload),
  });
  return res.json() as Promise<Cliente>;
}

export async function cep(cep: string) {
  const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  return res.json() as Promise<any>;
}