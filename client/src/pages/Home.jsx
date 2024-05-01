import { useNavigate } from "react-router-dom"
import { useEffect,useState } from "react"
import { toast } from "react-toastify"
import { socket } from "../socket"
import { useLocation } from "react-router-dom"

export const Home = () => {
    const location = useLocation()
    const state = location.state
    const [name, setName] = useState('');
    const navigate = useNavigate()
    const [roomErr,setRoomError]=useState('')
    const [availRoom,setAvailRoom]=useState([])
   
    useEffect(() => {
        socket.emit("get_avail_rooms")
       console.log("state",state)
        if (state && state.userName) {
            setName(state.userName)
        }
        if (name == "") {
            let randomNumber = Math.random();
            let randomString = randomNumber.toString();
            let randStr = randomString.split('.')[1].slice(0, 4);
            setName(`anonymouss_${randStr}`)
        }
    }, [])
    socket.on('avail_rooms', (data)=> {
        
        console.log("availroom", data)
        setAvailRoom(data.avail_rooms)
        
    })
    socket.on("room_connect", (data) => {
        console.log("room connect", data)
        navigate("/play", {
            state: {
                data: data,
                usr_name: name,
            }
        })
    })
    socket.on("wrong_rid", () => {
        setRoomError("Wrong room ID")
    })
    socket.on("create_room", (data) => {
        console.log('e create_room');
        console.log('data', data);
        navigate("/play", {
            state: {
                data: data ,
                usr_name: name,
                // opp_name:""
        } })
    })
    const createRoom = () => {
       
        socket.emit("new_room", { "usr_name": name })
    }
    const join = () => {
       
        const rid = document.getElementById("rid-input").value
        socket.emit("join_room", { "rid": rid, "usr_name": name })
    }
    return <>
       

        <div className="flex items-center justify-center">
            <h1 className="font-bold text-blue-600 text-[40px]">Tic-Tac-Toe</h1>
            </div>
            <div className="flex w-full">
            <div className="md:w-1/3 flex justify-center  ">

                    <div  className="flex flex-col items-center  border rounded m-3 mt-2 p-2 ">
                    
                        <span>Available Room</span>
                        <ul className="list-unstyled" id="room-list">
                        {  availRoom && availRoom.map((item, index) => {
                            
                            return (
                                <li key={index}> {item} </li>
                            )
                        })}    
                        </ul>
                    </div>
                </div>
            <div className="md:w-1/3 flex flex-col items-center justify-center ">
                    <p id="enterName"> Hi {name} !</p>
                <p className="font-weight-bold"> Enter Room ID:</p>
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <input
                        id="rid-input"
                        type="text"
                        className="relative m-0 -me-px block flex-auto rounded-s border border-solid border-neutral-200 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-surface outline-none transition duration-200 ease-in-out placeholder:text-neutral-500 focus:z-[3] focus:border-primary focus:shadow-inset focus:outline-none motion-reduce:transition-none "
                        placeholder="09200311"
                        aria-label="Recipient's username"
                        aria-describedby="button-addon2" />
                    <button
                        className="border border-blue-200 text-blue-500 py-2 px-4 rounded hover:border-blue-600 "

                        type="button"
                        id="join-btn"
                        onClick={() => { join() }}>
                        Join
                    </button>
                    {
                        roomErr != "" ? <>
                            

                            <div className="w-full flex items-center  justify-center my-2 text-red-500 border border-red-500 p-2  rounded-md">

                            <span > Wrong room number !</span>
                            </div>
                        </>:<></>
                    }
                </div>
                    <p> Or </p>
                    <div className="flex">
                    <button onClick={()=>createRoom()} id="create-room" className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"> Create new room</button>
                    </div>

                </div>
               
            </div>
    
    </>
}