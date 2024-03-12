import PropTypes from 'prop-types'
import { useSpring, animated } from '@react-spring/web'

const Hand = ({anime}) => {
    const range = 5
    const pointing = useSpring({
      from: { x: -range },
      to: [{ x: range }, { x: -range }],
      loop: true
    })
  
    return (
      <animated.div style={anime} className="p-8 h-full flex justify-center flex-col items-center">
        <h1 className="font-black text-3xl text-center capitalize mb-4">
          Seleciona un cliente
        </h1>
        <p className="text-center font-medium text-lg text-slate-700 mb-4">
          para ver los detalles de la dueda
        </p>
        <div className="p-8 rounded-lg w-48">
          <animated.img src="/Hands.webp" style={pointing} />
        </div>
      </animated.div>
    )
  }
  
  Hand.propTypes = {
    anime: PropTypes.object
  }

  export default Hand