
interface ClienteInterface {
  nmCompleto: string,
  ordem_servico:string,
  endereco:string,
  email:string
}
interface BoxClienteProps {
  cliente: ClienteInterface[]
}

function BoxCliente(cliente: BoxClienteProps) {
  return (
    <div>
      <div className=''>
        
        
      </div>
    </div>
  )
}

export default BoxCliente