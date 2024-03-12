import PropTypes from 'prop-types'

const DetailedClientRow = ({ name, price, date }) => {
  const clickhander = ({ currentTarget }) => {
    const checkBox = currentTarget.querySelector('input')
    checkBox.checked = !checkBox.checked
  }

  return (
    <li
      className="DetailedClientRow grid border-t-2 border-slate-50 hover:bg-slate-100 cursor-pointer font-medium"
      onClick={clickhander}
    >
      <span className="grid place-items-center">
        <input
          className="w-6 h-6 pointer-events-none"
          type="checkbox"
          name={name}
          defaultChecked={false}
        />
      </span>
      <span className="flex justify-start items-center capitalize text-sm">
        {name}
      </span>
      <span className="grid place-items-center text-sm italic">
        {price}
      </span>
      <span className="grid place-items-center">{date}</span>
    </li>
  )
}

DetailedClientRow.propTypes = {
  name: PropTypes.string,
  price: PropTypes.number,
  date: PropTypes.string
}

export default DetailedClientRow
