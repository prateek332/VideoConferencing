import { Firestore } from 'firebase/firestore'
import { createContext, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Room from './components/Room'
import RoomWithoutUsername from './components/RoomWithoutUsername'
import initializeFirebase from './firebase/firebaseApp'


const [app, db] = initializeFirebase();

const AppContext = createContext<Memo>({} as Memo);

function App() {

  const [username, setUsername] = useState('');
  const [localStream, setLocalStream] = useState(null);

  const memo = {
    db,
    username, setUsername,
    localStream, setLocalStream,
  };

  return (
    <AppContext.Provider value={memo as Memo}>
      <div className="App-header">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:roomId">
            {
              username.length > 0 ?
                <Route path="/:roomId" element={<Room />} /> :
                <Route path="/:roomId" element={<RoomWithoutUsername />} />
            }
          </Route>
        </Routes>
      </div>
    </AppContext.Provider>
  )
}

interface Memo {
  db: Firestore | any;
  username: string;
  setUsername: (username: string) => void;
  localStream: MediaStream | null;
  setLocalStream: (localStream: MediaStream | null) => void;
}

export default App
export { AppContext }
