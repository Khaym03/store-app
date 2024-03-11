import { useRef } from 'react'
import { URLs } from '../../constants'
import { FetchTable } from '../../hooks/FetchTable'
import { postClient } from '../../utils'
import Button from '../../comp/Button'
import Input from '../../comp/Input'
import { MdAdd } from 'react-icons/md'
import PropTypes from 'prop-types'

const ClientDialog = ({ setUpdateClientList }) => {
  const { data } = FetchTable(URLs.getClientsURL)

  const dialogRef = useRef(null),
    inputRef = useRef(null)

  const popup = () => dialogRef.current.showModal()
  const close = () => dialogRef.current.close()

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
        <MdAdd size={'1.5rem'} className="mr-2" />
        Nuevo cliente
      </Button>

      <dialog
        ref={dialogRef}
        className=" w-72 border-solid border-2 border-slate-100 shadow-lg rounded-lg"
      >
        <div className="grid grid-rows-2 gap-2 w-full h-full p-4">
          <Input placeholder="Ingrese el nombre" ref={inputRef} />
          <div className="grid grid-cols-2 gap-2">
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
