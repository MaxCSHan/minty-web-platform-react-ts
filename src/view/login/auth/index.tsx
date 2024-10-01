import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { loginWithGoogle, isLoggedIn } from '../../../services/authService'
import { ReactComponent as Logo } from 'assets/svg/logo.svg'
//
const SignInBtn = (props: { keyword: string; bg: string }) => {
  useEffect(() => console.log('Sign in desu'), [])
  const history = useHistory()

  const login = async () => {
    await loginWithGoogle()
    if (isLoggedIn()) history.push('/')
  }

  const { keyword, bg } = props
  const btn = () => {
    switch (bg) {
      case 'white':
        return (
          <div
            onClick={() => login()}
            className="cursor-pointer flex justify-center w-56 bg-white border-2 border-black text-black rounded-full mb-5 p-2"
          >
            {keyword}
          </div>
        )
      default:
        return <div className={`cursor-pointer flex justify-center w-56 bg-black text-white rounded-full mb-5 p-2`}>{keyword}</div>
    }
  }
  return (
    // <Link to="/">{btn()}</Link>
    btn()
  )
}
SignInBtn.defaultProps = {
  bg: 'black'
}

//

const Auth = () => {
  return (
    <div className="h-screen flex  bg-cover bg-moctar-bg dark:bg-gray-800 dark:text-white">
      <div className="m-auto justify-around flex flex-col items-center md:justify-center">
        <div className=" md:w-3/5 flex flex-col  items-center justify-items-center rounded-lg p-5">
          <div className="content-center pb-20 sd:pb-40 md:pb-8 ">
            <div className="box-content">
              <Logo />
            </div>
            <div className="title">mintyspace</div>
          </div>

          <div className="w-9/12 md:w-full text-xl sd:text-2xl md:text-3xl font-bold">
            A collaborative space that connects you to other creators alike
          </div>
          <div className=" w-full rounded-lg flex ">
            <div className="h-full w-full m-auto p-5">
              <div className="h-35 w-full mt-10 sd:mt-20 flex flex-col items-center">
                <div className="pb-3">Continue with</div>
                {/* <SignInBtn keyword={"Sign in with Apple"} bg={'black'}></SignInBtn> */}
                <SignInBtn keyword={'Sign in with Google'} bg={'white'}></SignInBtn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth
