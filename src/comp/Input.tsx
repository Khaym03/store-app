import React from "react";

type input = {
    placeholder: string
    changeHandler: () => void
    className?: string
}

const Input = React.forwardRef(({placeholder,changeHandler, className}:input,ref) => {
    return (
        <div className="relative w-full h-12 ">
          <input
            className={`absolute text-center w-full h-full text-sm font-medium rounded-lg border-solid border border-slate-200 shadow-sm ${className??''}`}
            type="text"
            placeholder={placeholder}
            onChange={changeHandler}
            ref={ref}
          />
        </div>
      )
})

export default Input