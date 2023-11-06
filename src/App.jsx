import Lobby from "./components/Lobby"
import RoomPage from './components/RoomPage'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";


function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/"
            element={<Lobby />}>
          </Route>
          <Route exact path="/room/:roomid"
            element={<RoomPage />}>
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
