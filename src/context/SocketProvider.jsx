import { createContext, useContext, } from "react"
import { io } from "socket.io-client";
import PropTypes from "prop-types";

export const SocketContext = createContext();

export const UseSocket = () => useContext(SocketContext);


export default function SocketProvider(props) {
    const socket = io('http://localhost:8000')
    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    )
}

SocketProvider.propTypes = {
    children: PropTypes.node.isRequired,
};







