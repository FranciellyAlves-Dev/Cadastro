import axios from "axios";
export default async function viacep(cep: string) {
  const clean = cep.replace(/\D/g, "");
  const { data } = await axios.get(`https://viacep.com.br/ws/${clean}/json/`);
  return data;
}