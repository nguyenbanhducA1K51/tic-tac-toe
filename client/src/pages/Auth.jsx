import { useState } from "react"
import { useNavigate } from "react-router-dom"
export const Auth = () => {
    const navigate=useNavigate()
    const [userName,setUsrName]=useState("")
    const [password, setPassword] = useState("")
    const handleChangeUserName = (e) => {
        setUsrName(e.target.value)
    }
    const handleChangePassword= (e) => {
        setPassword(e.target.value)
    }
    const login = () => {
        localStorage.setItem('userName',userName)
        navigate("/home", {
            state: {
            userName:userName
        }})
    }
    const navigateSignup = () => {
        navigate("/signup")
    }
    return (

        <>
            <div>

                        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                                <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company"/>
                                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Login to your account</h2>
                            </div>

                            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                                <form className="space-y-6" action="#" method="POST">
                                    <div>
                                        <label htmlFor="userName" className="block text-sm font-medium leading-6 text-gray-900">User name</label>
                                        <div className="mt-2">
                                            {/* <input id="email" name="email" type="email" autoComplete="email" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/> */}
                                    <input value={userName} onChange={handleChangeUserName} name="userName" type="text" required  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>        
                                </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between">
                                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                                            <div className="text-sm">
                                                {/* <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a> */}
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <input value={password} onChange={handleChangePassword} id="password" name="password" type="password" autoComplete="current-password" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                        </div>
                                    </div>

                                    <div className="flex justify-between">
                                        <button onClick={()=>login()} type="button" className=" m-2 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Log in</button>
                                <button onClick={() => navigateSignup()} type="button" className="m-2 flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Create new account</button>       
                            </div>
                                </form>

                                
                            </div>
                        </div>


            </div>
        </>
    )
}