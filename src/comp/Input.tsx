import React from "react";

type input = {
    placeholder: string
    changeHandler?: () => void
    className?: string
}

// "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",

const Input = React.forwardRef(({placeholder,changeHandler, className}:input,ref) => {
    return (
        <div className="relative w-full h-12 ">
          <input
            className={`absolute text-center w-full h-full text-sm font-medium rounded-lg border-solid border transition-shadow focus-visible:outline-none border-slate-200 shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className??''}`}
            type="text"
            placeholder={placeholder}
            onChange={changeHandler}
            ref={ref}
          />
        </div>
      )
})

export default Input