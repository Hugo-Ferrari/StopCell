import { Search } from "lucide-react";

function ClienteExistente() {
  return (
    <div className="bg-white p-4 sm:p-6">
      <div className="space-y-4">



        <div className="bg-white   sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            Cliente 
          </h2>

          <p className="text-sm text-gray-500 mt-1 mb-4">
            Selecione um cliente para criar a Ordem de Serviço.
          </p>

          <div className="flex items-center border rounded-lg px-3 py-3 focus-within:ring-2 focus-within:ring-orange-500">
            <Search size={18} className="text-gray-400 "
            />

            <input type="text" placeholder="Nome, CPF ou telefone" className="flex-1 ml-3 outline-none text-sm" />
          </div>
        </div>


        <div className="bg-white pt-4 sm:p-6">

          <h3 className="text-lg font-semibold mb-5">
            Dados da Ordem de Serviço
          </h3>

          <div className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Cliente
              </label>

              <input type="text" placeholder="Selecione um cliente" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modelo do Aparelho
              </label>

              <input type="text" placeholder="Ex.: iPhone 13" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relato do Problema
              </label>

              <textarea rows={5} placeholder="Descreva o problema..." className="w-full rounded-lg border border-gray-300 px-4 py-3 resize-none outline-none focus:ring-2 focus:ring-orange-500" />
            </div>

            <button className="w-full bg-orange-500 hover:bg-orange-600  text-white font-semibold py-3 rounded-lg transition">
              Gerar Os Digital
            </button>
            <button className="w-full bg-gray-400 hover:  text-white font-semibold py-3 rounded-lg transition">
              Cancelar
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

export default ClienteExistente;