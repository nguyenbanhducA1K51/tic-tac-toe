import { useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { socket } from "../socket"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
export const Play = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const state = location.state
    const [waitmsg, setWaitMsg] = useState("Waiting for people to join ...")
    console.log("data", state)
    const [chatMsg, setChatMsg] = useState([])
    const [inputMsg,setInputMsg]=useState("")
    const [myTurn, setMyturn] = useState(false)
    const [usrName, setUsrName] = useState("")
    const [opp_name, setOppName] = useState("")
    const [sign, setSign] = useState("X")
    const [rid, setRid] = useState("")
    const [board, setBoard] = useState([
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ])

    useEffect(() => {
        if (!state) {
            navigate("/")
        }
        if (state.usr_name) {
            setUsrName(state.usr_name)
        }
      
        if (state.data && state.data.opp_usr_name) {
            console.log("late join", state.data)
            if (state.data.turn == 1) {
                setMyturn(true)
            }
            else {
                setMyturn(false)
            }
            setSign("O")
            setOppName(state.data.opp_usr_name)
            setWaitMsg("")
        }
        setRid(state.data.rid)
    }, [])
    useEffect(() => {
        if (checkWin()) {
            socket.emit("win")
            document.getElementById("win-msg").innerText = "You win"
            setTimeout(handleExit, 2000)
            return
        }

    }, [board])
    const handleExit = () => {
        navigate("/")
    }
    const btnExit = () => {
        socket.emit("exit")
        navigate("/")
    }
    const checkWin = () => {
        console.log("call check win,", board)
        const len = 3
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < len; j++) {
                // check row
                if (j + 1 < len && j + 2 < len && board[i][j] == sign && board[i][j + 1] == sign && board[i][j + 2] == sign) {
                    return true
                }
                // check col
                if (i + 1 < len && i + 2 < len && board[i][j] == sign && board[i + 1][j] == sign && board[i + 2][j] == sign) {
                    return true
                }
                if (i + 1 < len && i + 2 < len && j + 1 < len && j + 2 < len && board[i][j] == sign && board[i + 1][j + 1] == sign && board[i + 2][j + 2] == sign) {
                    return true
                }
                if (i + 1 < len && i + 2 < len && j + 1 < len && j + 2 < len && board[i][j] == sign && board[i + 1][j + 1] == sign && board[i + 2][j + 2] == sign) {
                    return true
                }
                if (i + 1 < len && i + 2 < len && j - 1 < len && j - 2 < len && board[i][j] == sign && board[i + 1][j - 1] == sign && board[i + 2][j - 2] == sign) {
                    return true
                }

            }
        }
        return false

    }
    socket.on("other_join", (e) => {
        console.log("other join", e)
        setOppName(e.opp_usr_name)
        if (e.turn == 1) {
            setMyturn(true)
        }
        else {
            setMyturn(false)
        }
        setWaitMsg("")
    })
    socket.on("next_turn", (e) => {
        console.log('e next_turn', e);
        const { rowIdx, colIdx } = e
        const newBoard = board.map((row, rIdx) =>
            row.map((value, cIdx) => {
                if (rIdx === rowIdx && cIdx === colIdx && !value) {
                    if (sign == "X") {
                        return "O"
                    } else {
                        return "X"
                    }
                }
                return value

            }

            )
        );
        setBoard(newBoard)
        setMyturn(false)
        setMyturn(true)

    })
    socket.on("opp_win", () => {
        document.getElementById("win-msg").innerText = "Opponent win"
        setTimeout(handleExit, 3000)

    })
    socket.on("user_left", () => {
        setWaitMsg("User left")
        setTimeout(handleExit, 3000)
    })

    socket.on("otherMsg", e => {
        console.log("otherMsg", e)
        const newMsg = [...chatMsg, [opp_name, e.msg]]
        setChatMsg(newMsg)
        setInputMsg("")

})
    const tick = (rowIdx, colIdx) => {
        if (!opp_name) {
            return toast.error("opponent has not join")
        }
        if (!myTurn) {
            toast.error("Not your turn")
            return
        }
        if (board[rowIdx][colIdx]) {
            return toast.error("This cell has been played ")
        }
        const newBoard = board.map((row, rIdx) =>
            row.map((value, cIdx) => {
                if (rIdx === rowIdx && cIdx === colIdx && !value) {
                    return sign
                }
                return value

            }

            )
        );

        setBoard(newBoard)

        setMyturn(false)
        socket.emit('next_turn',
            {
                "rid": rid,
                "pos": {
                    "rowIdx": rowIdx,
                    "colIdx": colIdx
                }
            }
        );
    }
    const sendMsg = () => {
        socket.emit("sendMsg", { "rid":rid, "msg": inputMsg })
        const newMsg = [...chatMsg, [usrName, inputMsg]]
        setChatMsg(newMsg)
        setInputMsg("")


    }
    
    const handleMsgInputChange = (event) => {
        setInputMsg(event.target.value); // Update the state with the input value
    }
    const Message = (prop) => {
        const { isCurrentUser, msg } = prop
        return (
            <>
                {
                    isCurrentUser ?
                        <>
                            <span> <span className="text-primary font-bold"> {usrName} :</span>{chatMsg.substring()}</span>
                        </> :
                        <>
                            <span> <span className="text-red font-bold"> {opp_name} :</span>{chatMsg.substring()}</span>
                        </>
                }
            </>

        )
    }

    return (
        <>
            <div className="flex">
                <div className="flex-1 flex flex-col justify-center items-center ">

                    <div className="m-2 flex flex-col justify-center items-center">
                        <span>Room ID: {rid}</span>
                        <span id="connect-msg">{waitmsg} </span>
                        <span id="turn-msg">{myTurn ? "Your turn" : "Other turn"}</span>
                        <span className="font-weight-bold display-2" id="win-msg"> </span>
                    </div>
                    <div className="flex justify-around w-full">

                        <div className="p-2"> <span id="your-name">{usrName}</span></div>

                        <div className="p-2"><span id="their-name">{opp_name}</span></div>
                    </div>
                    <div className="flex items-center justify-center">
                        <button onClick={() => btnExit()} id="exit-btn" className="m-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"> Exit</button>
                    </div>
                    <div className="w-full  flex  items-center justify-center ">

                        <table className="">
                            <tbody>
                                {board.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {row.map((value, colIndex) => {
                                            const id = `cell-${rowIndex}-${colIndex}`
                                            return (
                                                <td className="w-[100px] h-[100px]" onClick={() => { tick(rowIndex, colIndex) }} id={id} key={colIndex}>
                                                    {value}
                                                </td>
                                            )
                                        }
                                        )}

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
                <div className="flex-1 flex flex-col items-center mt-[100px]">
                        <span> Chatbox</span>
                    <div className="flex flex-col items-start justify-end border rounded m-3 mt-2 p-2 w-2/3 h-[500px] overflow-auto">

                      
                            {chatMsg && chatMsg.map((item, idx) => { 
                                console.log(item,idx)
                                return (
                                    <>
                                        
                                        {

                                        item[0]==usrName?
                                        <>
                                            <span id={idx}> <span className="text-blue-600 font-bold"> {usrName} : </span>{item[1].substring()}</span>
                                        </> :
                                        <>
                                            <span id={idx}> <span className="text-red-400 font-bold"> {opp_name} : </span>{item[1].substring()}</span>
                                        </>
                                        }
                                    </>
                                )
                            })  }
                        <div className="relative  flex w-full flex-wrap items-stretch">
                            <input
                                id="name-input"
                                type="text"
                                className="relative m-0 -me-px block flex-auto rounded-s border border-solid border-neutral-200 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-surface outline-none transition duration-200 ease-in-out placeholder:text-neutral-500 focus:z-[3] focus:border-primary focus:shadow-inset focus:outline-none motion-reduce:transition-none "
                                placeholder="chat"
                                aria-label="Recipient's username"
                                aria-describedby="button-addon2"
                                value={inputMsg}
                                onChange={handleMsgInputChange} />
                            <button
                                className="border border-blue-200 text-blue-500 py-2 px-4 rounded hover:border-blue-600 "

                                type="button"
                                id="join-btn"
                                onClick={() => {sendMsg() }}>
                                send
                            </button>


                        </div>

                    </div>
                    <div> </div>
                </div>

            </div>
        </>
    )
}