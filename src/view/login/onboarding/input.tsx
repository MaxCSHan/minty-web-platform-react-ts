import { useState,useEffect } from "react"
type cusInputType  = {
    inlineText:string,
    profileOnChange:(blankName:string,inputValue:string) =>void
}

const CusInput = ({inlineText,profileOnChange}:cusInputType) => {
    const [onClick,setOnclick] = useState(false)
    const [inputValue, setInputValue] = useState("");
    
    const name = inlineText.replace(/\s/g, '');

    useEffect(()=>{
        profileOnChange(name,inputValue);
    }
    ,[inputValue,name,profileOnChange])
  
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "") setInputValue("");
      else {
        setInputValue(value);
      }
    };
  return (
    <div
      className={`static text-lg w-48 flex items-center justify-center rounded-full px-8 py-2 my-4  ${onClick?"cursor-text  border-4 border-blue-400":"cursor-pointer"} ${onClick || inputValue.length>0?"shadow-lg":"shadow-none"} transition-all duration-300 ease-in-out bg-gray-200 text-black `}
    >
      <div className={`relative text-center whitespace-nowrap w-full h-8 z-10 transition-all duration-200 ease-in-out pointer-events-none ${onClick || inputValue.length>0? '-top-7 -left-2 text-xs' : 'top-1 left-16 text-base'}`}>
        {inlineText}
      </div>
      <input value={inputValue} className={`relative w-36  -left-6  bg-gray-200 focus:outline-none ${onClick || inputValue.length>0?"cursor-text":"cursor-pointer"}`}
      onChange={(e)=>handleInput(e)}
      onFocus={() => setOnclick(true)}
      onBlur={() => setOnclick(false)}
      />
      
    </div>
  )
}

export default CusInput;