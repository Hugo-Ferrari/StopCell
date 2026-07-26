

function NovoCliente() {
  return (
    <div className="bg-white border border-gray-200  p-4 sm:p-6">
      <div className="space-y-4">

        <div className="">
          <label className="block  font-medium text-gray-700 mb-2 ">
            Cliente
          </label>

          <input type="text" placeholder="Digite o nome completo" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500" />
        </div>

        <div>
          <label className="block  font-medium text-gray-700 mb-2">
            CPF
          </label>

          <input type="text" placeholder="000.000.000-00" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block  font-medium text-gray-700 mb-2">
            WhatsApp
          </label>

          <input type="text" placeholder="(00) 00000-0000" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
        <div>
          <label className="block  font-medium text-gray-700 mb-2">
            Modelo Do Aparelho
          </label>

          <input type="text" placeholder="Ex: Iphone 13, Samsung A54..." className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
          <label className="block  font-medium text-gray-700 mb-2">
            Relato do Problema
          </label>

          <textarea rows={5} placeholder="Descreva o problema do aparelho relatado pelo cliente..." className="w-full rounded-lg border border-gray-300 px-4 py-3 resize-none outline-none focus:ring-2 focus:ring-orange-500" />
        </div>

        <button className="w-full bg-orange-500 hover:bg-orange-600  text-white font-semibold py-3 rounded-lg transition">
          Gerar Os Digital
        </button>
        <button className="w-full bg-gray-400 hover:  text-white font-semibold py-3 rounded-lg transition">
          Cancelar
        </button>

      </div>
    </div>

  );

}

export default NovoCliente