import { createContext, useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'

import Home from './components/Home'
import Room from './components/Room'
import initializeFirebase from './firebase/firebaseApp'
import { Firestore } from 'firebase/firestore'
import { FirebaseApp } from 'firebase/app'

const [app, db] = initializeFirebase();

const AppContext = createContext<Memo>({} as Memo);

function App() {

  const memo = {
    db,
  };

  return (
    <AppContext.Provider value={memo}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:roomId" element={<Room />} />
      </Routes>
    </AppContext.Provider>
  )
}

interface Memo {
  db: Firestore | any;
}

export default App
export { AppContext }