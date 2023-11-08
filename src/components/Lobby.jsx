import logo from '../images/logo2.png'
import '../styles/Lobby.css'
import {  useState,useEffect } from 'react'
import { UseSocket } from '../context/SocketProvider';
import { useNavigate } from 'react-router-dom';


export default function Lobby() {

    const navigate = useNavigate();
    const lobbysocket = UseSocket();
    const [name, setname] = useState('');
    const [roomno, setroomno] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        lobbysocket.emit('new-user-joined', { name, roomno });
    }

    useEffect(() => {
        const handleUserJoinedEmit = (data) => {
            const { roomno } = data;
            navigate(`/room/${roomno}`);
        }
        lobbysocket.on('user-joined', handleUserJoinedEmit)
        return () => {
            lobbysocket.off('user-joined', handleUserJoinedEmit)
        }
    }, [lobbysocket, navigate]);


    return (
        <>
            <div className="navbar">
                <img src={logo} alt="" />
            </div>
            <div className="main-lobby">
                <form  >
                    <div className='header'>
                        <h2>👋 Create or Join Room</h2>
                    </div>

                    <div className='main-lobby-body' >
                        <label>Your Name</label>
                        <input type="text" name="name" value={name} onChange={(e) => { setname(e.target.value) }} required placeholder="Enter your display name..." />
                        <label>Room Name</label>
                        <input type="text" name="room" value={roomno} onChange={(e) => { setroomno(e.target.value) }} placeholder="Enter room name..." />
                        <button onClick={handleSubmit}>Go to Room </button>
                    </div>
                </form>
            </div>

        </>
    )
}
