import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import img from '../../../assets/image/onboarding.jpg'
import CusInput from './input'
const Onboarding = () => {
  const [loaded, setLoaded] = useState(false)
  const [profile, setProfile] = useState({})
  const [selectedProf, setSelectedProf] = useState('')
    const history = useHistory();
  const profileOnChange = (blankName: string, inputValue: string) => {
    setProfile({ ...profile, [blankName]: inputValue })
  }
  useEffect(() => {
    setLoaded(true)
  }, [])

  const list = ['Photographer', 'Model', 'Both']

  const profileSpecs = ['Username', 'Full Name']

  const professionsOptions = (
    <div
      className={`absolute flex flex-col items-center transition-all delay-100 duration-700 ease-out ${
        loaded ? 'opacity-100 top-72' : 'opacity-0 top-96'
      }`}
    >
      <div className="mb-10 sm:mb-20">
        <img className="h-60 sm:h-80" alt="" src={img} />
      </div>
      <div className="flex flex-col items-center justify-center min-w-max">
        {list.map((ele) => (
          <div
            className={`text-lg w-full flex items-center justify-center rounded-full px-8 py-2 my-4 hover:bg-black hover:text-white cursor-pointer transition-all duration-300 ease-in-out ${
              ele === selectedProf ? 'bg-black text-white shadow-lg' : 'bg-gray-200 text-black shadow-none'
            }`}
            onClick={() => setSelectedProf(ele)}
          >
            {ele}
          </div>
        ))}
      </div>
    </div>
  )

  const profileOptions = (
    <div
      className={`absolute flex flex-col items-center transition-all delay-100 duration-700 ease-out ${
        loaded ? 'opacity-100 top-72' : 'opacity-0 top-96'
      }`}
    >
      <div className="mb-10 sm:mb-20">
        <img className="h-60 sm:h-80" alt="" src={img} />
      </div>
      <div className="flex flex-col items-center justify-center min-w-max">
        {/* {profileSpecs.map((ele) => (
          <div className={`static text-lg w-full flex items-center justify-center rounded-full px-8 py-2 my-4 hover:bg-black hover:text-white cursor-pointer transition-all duration-300 ease-in-out bg-gray-200 text-black shadow-none`}
          onClick={()=>setSelectedProf(ele)}
          ><div className={`relative w-32 h-8 transition-all duration-200 ease-in-out ${false?"-top-8 -left-3 text-xs":"top-1 left-7 text-base"}`}>{ele}</div></div>
        ))} */}
      </div>
      {profileSpecs.map((ele) => (
        <CusInput profileOnChange={profileOnChange} inlineText={ele}></CusInput>
      ))}

      <div className="mt-32 flex  flex-col justify-center items-center">
        <div className="text-lg hover:border cursor-pointer" onClick={()=> history.push("/chat")}>
          All Set
        </div>
        <div>•</div>
        <div className="text-sm hover:border cursor-pointer" onClick={() => setSelectedProf('')}>
          Previous
        </div>
        
      </div>
    </div>
  )

  return <div className="relative h-screen w-screen flex items-center justify-center">{selectedProf ? profileOptions : professionsOptions}</div>
}

export default Onboarding
