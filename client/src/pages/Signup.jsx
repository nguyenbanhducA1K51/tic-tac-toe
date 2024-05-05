import { useState } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
export const Signup = () => {
    const navigate=useNavigate()
    const [userName, setUserName] = useState("")
    const [password,setPassword]=useState("")
    const [confirmPassword,setConfirmPassword]=useState("")
    const handleChangeUserName = (e) => {
        setUserName(e.target.value)
    }
    const handleChangePassword = (e) => {
        setPassword(e.target.value)
    }
    const handleChangeConfirmPassword = (e) => {
        setConfirmPassword(e.target.value)
    }
    const signup = () => {
        if (confirmPassword != password) {
        return toast.error("Password does not match")
        }
        if (!userName) {
            return toast.error("Empty name is not allowed !")
        }
        if (!password) {
            return toast.error("Empty password")
        }
        toast.info("Registered successfully !")
        setTimeout(() => {
            navigate("/")
        },1000)
    }
    const navigateLogin = () => {
        navigate("/")

    }
    return (
        <>
            <div>
                <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
                        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign up for new account</h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form className="space-y-6" action="#" method="POST">
                            <div>
                                <label htmlFor="userName" className="block text-sm font-medium leading-6 text-gray-900">User name</label>
                                <div className="mt-2">
                                    {/* <input id="email" name="email" type="email" autoComplete="email" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/> */}
                                    <input value={userName} onChange={handleChangeUserName} name="userName" type="text" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                                   
                                </div>
                                <div className="mt-2">
                                    <input value={password} onChange={handleChangePassword} id="password" name="password" type="password" autoComplete="current-password" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="confirm" className="block text-sm font-medium leading-6 text-gray-900">Confirm password</label>
                                    
                                </div>
                                <div className="mt-2">
                                    <input value={confirmPassword} name="confirm" onChange={handleChangeConfirmPassword} type="password" autoComplete="current-password" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                </div>
                            </div>

                            <div>
                                <button onClick={() => signup()} type="button" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign up</button>
                            </div>
                            <div className="text-sm">
                                <span onClick={()=>{navigateLogin()}} className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-500"> Go to Login</span>
                            </div>
                        </form>


                    </div>
                </div>


            </div>
        </>
    )
}