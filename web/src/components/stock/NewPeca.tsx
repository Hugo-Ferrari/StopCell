"use client";

import { criandoPeca } from "@/services/partService";
import { useState } from "react";

function NewPeca() {
  const [openModal, setOpenModal] = useState(false);

  const [valor, setValor] = useState(0);
  const [descricao, setDescricao] = useState("");
  const [quantidade, setQuantidade] = useState(0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await criandoPeca({
        descricao,
        valor,
        quantidade,
      });

      setOpenModal(false);
      setDescricao("");
      setValor(0);
      setQuantidade(0);
    } catch (error) {
      console.error("Erro ao criar peça:", error);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpenModal(true)}
        className="rounded-lg bg-primary px-4 py-2 font-medium text-white transition hover:opacity-90"
      >
        Nova Peça
      </button>

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Adicionar peça</h2>

                <p className="text-sm text-muted-foreground">
                  Cadastre uma nova peça no estoque
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpenModal(false)}
                className="text-xl text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="descricao" className="text-sm font-medium">
                  Nome da peça
                </label>

                <input
                  id="descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  type="text"
                  placeholder="Ex: Tela OLED iPhone 12"
                  className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="valor" className="text-sm font-medium">
                  Valor da peça
                </label>

                <input
                  id="valor"
                  value={valor}
                  onChange={(e) => setValor(Number(e.target.value))}
                  type="number"
                  step="0.01"
                  min=""
                  placeholder="0,00"
                  className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="quantidade" className="text-sm font-medium">
                  Quantidade
                </label>

                <input
                  id="quantidade"
                  value={quantidade}
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                  type="number"
                  min="0"
                  placeholder="0"
                  className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
                >
                  Adicionar peça
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewPeca;
