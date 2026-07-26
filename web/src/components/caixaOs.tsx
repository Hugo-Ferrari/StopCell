
import { Smartphone } from 'lucide-react'


function CaixaOs() {
    

    return (
        <div className='border p-4'>
            <div className='flex'>

                <p>
                    {/** numero da os */} #12345
                </p>
                <p className='ml-25'>
                    Finalizado {/** Criar componente separado para saber se foi finalizado, esta em andamento ou estat aguradando uma peça; */}
                </p>
            </div>
            <div>
                {/** caixa para mostrar "os finalizada, em andamento, diagnostico" */}
            </div>
            <div className='flex'>
                <div>
                    <Smartphone />
                </div>
                <div>
                    <h1>{/** colocar busca o nome do cliente de acordo com a ordem de serviço */} Sofia Cueto</h1>
                    <p>{/** nome do aparelho e data da os */} Iphone 12 Pro Max  . 10/06/2026</p>
                </div>
            </div>
        </div>
    )
}


export default CaixaOs