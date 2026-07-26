
import TabsClientes from '@/components/novaOs/TabsClientes'
import NavBar from '../components/navBar'

function NovaOrdemServico() {
  return (
    <div className='flex'>
        <NavBar/>
        <TabsClientes/>
    </div>
  )
}

export default NovaOrdemServico