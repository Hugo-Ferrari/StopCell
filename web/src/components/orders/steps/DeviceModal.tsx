import { criarAparelho, type AparelhoDto } from "@/services/deviceService";
import React, { useState } from "react";

interface DeviceModalInterface {
  aberto: boolean;
  onClose: () => void;
  clienteCpf: string;
}

function DeviceModal({ aberto, onClose, clienteCpf, }: DeviceModalInterface) {
  //fazer estados para todos os atributos
  const[modelo, setModelo] = useState("")
  const [cor, setCor] = useState  ("")
  const [imei, setImei] = useState("")
  const[senhaAparelho, setSenhaAparelho] = useState("")
  const[tipoSenha, setTipoSenha] = useState("")


  async function handleSubmit() {
    try {

      const data: AparelhoDto = {
      modelo,
      cor,
      imei,
      senhaAparelho,
      tipoSenha

    };

      await criarAparelho(data);

      alert("Aparelho criado");

    } catch (err) {
      console.log(err);
    }
  }



if (!aberto) return null;
return (
  <div
    className=" fixed inset-0 z-50 flex items-center justify-center bg-black/50  p-4 ">
    <div
      className=" w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card  p-6  shadow-xl ">

      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">
          Novo aparelho
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          CPF do cliente: {clienteCpf}
        </p>
      </div>


      <form>

        <div
          className="  grid  grid-cols-1  gap-5  md:grid-cols-2 ">

          <div className="md:col-span-2">

            <label className="mb-2 block font-medium text-foreground">
              Modelo
            </label>

            <input
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
              type="text"
              placeholder="Ex: iPhone 15 Pro"
              className="input-style"
            />

          </div>


          <div>

            <label className="mb-2 block font-medium text-foreground">
              IMEI
            </label>

            <input
            value={imei}
            onChange={(e) => setImei(e.target.value)}
              type="text"
              placeholder="Digite o IMEI"
              className="input-style"
            />

          </div>


          <div>

            <label className="mb-2 block font-medium text-foreground">
              Cor
            </label>

            <input
              value ={cor}
              onChange={(e) => setCor(e.target.value)}
              type="text"
              placeholder="Ex: Preto"
              className="input-style"
            />

          </div>


          <div>

            <label className="mb-2 block font-medium text-foreground">
              Marca
            </label>

            <input
            //colocar o value e o onchange de marca
              type="text"
              placeholder="Ex: Apple"
              className="input-style"
            />

          </div>


          <div>

            <label className="mb-2 block font-medium text-foreground">
              Senha do aparelho
            </label>

            <input
            //colocar o tipo de senha do aparelho
              type="text"
              placeholder="Senha/Padrão"
              className="input-style"
            />

          </div>

        </div>


        <div className="mt-8 flex justify-end gap-3">

          <button
            type="button"
            onClick={onClose}
            className="  rounded-lg border border-border px-5 py-2  text-muted-foreground  hover:bg-accent">
            Cancelar
          </button>


          <button
          onClick={handleSubmit}
            type="submit"
            className=" rounded-lg bg-primary px-5 py-2  font-semibold  text-primary-foreground hover:opacity-90">
            Salvar
          </button>

        </div>

      </form>

    </div>

  </div>
);
}

export default DeviceModal;