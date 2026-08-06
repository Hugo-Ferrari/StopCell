
interface ClienteInterface {
  nmCompleto: string,
  ordem_servico:string,
  endereco:string,
  email:string
}
interface BoxCliente{
  cliente: ClienteInterface[]
}

function BoxCliente({cliente}:BoxCliente) {
  return (
    <div>
      <div className=''>
        
        
      </div>
    </div>
  )
}

export default BoxCliente