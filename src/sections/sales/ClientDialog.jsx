import { useRef } from 'react'
import { URLs } from '../../constants'
import { FetchTable } from '../../hooks/FetchTable'
import { postClient } from '../../utils'
import Button from '../../comp/Button'
// import Input from '../../comp/Input'
import { MdAdd } from 'react-icons/md'
import PropTypes from 'prop-types'

const ClientDialog = ({ setUpdateClientList }) => {
  const { data } = FetchTable(URLs.getClientsURL)

  const dialogRef = useRef(null),
    inputRef = useRef(null)

  const popup = () => dialogRef.current.showModal(),
    close = () => dialogRef.current.close()

  const addClient = () => {
    const name = inputRef.current.value.toLowerCase()

    const alreadyExist = data.find(client => name === client.name.toLowerCase())

    if (alreadyExist) {
      inputRef.current.value = ''
      inputRef.current.placeholder = 'Ese Nombre ya existe'
    } else {
      inputRef.current.value = ''
      inputRef.current.placeholder = 'Ingre el Nombre'
      postClient(name)
      dialogRef.current.close()
      setUpdateClientList(true)
    }
  }

  return (
    <div>
      <Button clickHandler={popup} actionType="main">
        <MdAdd size={'1.5rem'} className='mr-2'/>
        Nuevo cliente
      </Button>

      <dialog
        ref={dialogRef}
        className=" w-72 h-48 absolute inset-2/4 -translate-y-2/4 -translate-x-2/4 border-solid border-2 border-slate-100 shadow-lg rounded-lg"
      >
        <div className="grid grid-rows-2 gap-4 w-full h-full p-4">
          <div className="relative">
            <input
              className="text-sm font-medium w-full text-center shadow-sm border-solid border-2 border-slate-100 rounded-lg h-full absolute"
              type="text"
              placeholder="Ingrese el Nombre"
              ref={inputRef}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button clickHandler={close}>Cancel</Button>
            <Button clickHandler={addClient} actionType="main">
              Añadir
            </Button>
          </div>
        </div>
      </dialog>
    </div>
  )
}

ClientDialog.propTypes = {
  setUpdateClientList: PropTypes.func
}

export default ClientDialog
