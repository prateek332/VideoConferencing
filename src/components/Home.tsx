import { FirebaseApp } from "firebase/app";
import { addDoc, collection, doc, Firestore, getDoc, updateDoc } from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import appConfig from "../app.config";

import logoImage from '../assets/icons/logo.svg';

const usernameWarningMessage = `Username is required and must be btw 5 to 20 characters`;
const roomIdWarningMessage = `Either room id is incorrect or room doesn't exists`;

export default function Home() {

  const navigate = useNavigate();

  const [usernameWarning, setUsernameWarning] = useState<boolean>(false);
  const [showLocalFeed, setShowLocalFeed] = useState<boolean>(false);
  
  const roomIdRef = useRef<HTMLInputElement>(null);
  const [roomIdWarning, setRoomIdWarning] = useState<boolean>(false);

  const {
    db,
    username, setUsername,
    localStream, setLocalStream,
  } = useContext(AppContext);

  // checking if username is saved in local storage
  useEffect(() => {
    setUsername(getUsername());
  },[]);


  const onUsernameSubmit = () => {
    if (_onUsernameSubmit(username)) {
      getCallDoc(db)
        .then(callDocRef => navigate(`/${callDocRef.id}`));
    } else {
      setUsernameWarning(true);
    }
  }

  const onRoomIdSubmit = () => {
    const roomId = roomIdRef.current?.value;
    if (roomId !== undefined) {
      _onRoomIdSubmit(db, roomId)
        .then(roomExists => {
          if (roomExists){
            navigate(`/${roomId}`);
          } else {
            setRoomIdWarning(true);
          }
        })
    } else {
      setRoomIdWarning(true);
    }
  }

  return (
    <div className="waves-background flex flex-col md:flex-row flex-wrap justify-center items-center h-full w-full">

      {/* User greeting, username input box, room-id input box */}
      <div className="flex flex-col items-center mb-14 md:mb-0">

        {/* user  greeting */}
        <div className="w-72 md:w-9/12 mb-8 text-3xl text-center">
          Hi👋🏻, enter a username to start chatting with your friends
        </div>

        {/* username input box and incorrect username warning */}
        <div className="flex flex-col justify-center items-center">

          {/* username input box and submit button */}
          <div>
            <input
              type="text"
              placeholder="username..."
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="p-2 m-3 w-44 md:w-64 text-green-800 bg-white rounded-2xl 
              text-xl border-0 shadow outline-none focus:outline-none focus:ring"
            />

            <button
              onClick={_ => onUsernameSubmit()}
              className="p-1 w-16 md:w-20 md:h-10 bg-green-600 rounded-3xl font-bold text-white text-xl
              transition duration-300 ease-in-out hover:bg-green-400 hover:scale-110"
            >🚀Go</button>
          </div>

          {/* username warning */}
          <div>
            {usernameWarning && <div className="text-red-600 text-base w-72 text-center md:w-full md:text-xl">
              {usernameWarningMessage}
            </div>}
          </div>

        </div>

        <div className="p-2 m-2 text-4xl font-semibold">
          Or
        </div>

        {/* room id input box */}
        <div className="p-2 m-2 w-72 md:w-9/12 flex flex-col items-center">
          <div className="text-center text-3xl">
            Enter a room id to join a chat room
          </div>
          <div className="flex justify-center items-center">
            <input
              type="text"
              ref={roomIdRef}
              placeholder="room id..."
              className="p-2 m-3 w-44 md:w-64 text-green-800 bg-white rounded-2xl
              text-xl border-0 shadow outline-none focus:outline-none focus:ring"
            />
            <button
              onClick={_ => onRoomIdSubmit()}
              className="p-1 w-20 h-10 md:w-20 md:h-10 bg-green-600 rounded-3xl font-bold text-white text-xl
              transition duration-300 ease-in-out hover:bg-green-400 hover:scale-110"
            >🚪Join</button>

            {/* roomId warning */}
            <div>
              {roomIdWarning && <div className="text-red-600 text-base w-72 text-center md:w-full md:text-xl">
                {roomIdWarningMessage}
              </div>}
            </div>
          </div>
        </div>

      </div>

      {/* site logo and webcam stream*/}
      <div className="flex flex-col justify-between items-center">
        <div>
          {
            !showLocalFeed &&
              <div className="w-56 md:w-64 mb-8">
                <img src={logoImage} alt="logo" />
              </div>
          }

          <video 
            id="localStreamHome" 
            autoPlay 
            muted 
            playsInline 
            hidden
            className="w-64 sm:w-96 md:w-full border-4 border-green-400 rounded-3xl transition-all duration-300 ease-in-out"
          ></video>

        </div>
        
        <div>
          <button
            id="startWebcamButton"
            onClick={_ => onWebcamButtonClick(setShowLocalFeed, setLocalStream)}
            className="p-1 w-40 bg-yellow-500 rounded-3xl font-bold text-blue-800 text-xl
            transition duration-200 ease-in-out hover:bg-yellow-400 hover:scale-110"
          >Start Webcam</button>
        </div>

      </div>

    </div>
  );
}

function getUsername(): string {
  const username = localStorage.getItem('username');
  return username ? username : '';
}

function _onUsernameSubmit(username: string) {

  if (username.length < 5 || username.length > 20) {
    return false;
  } 
  // save username for the next time user visits the site
  localStorage.setItem('username', username);
  return true;
}

async function _onRoomIdSubmit(db: Firestore, roomId: string) {
  const roomIdString = roomId.split('/').reverse()[0];

  let docSnap;
  try {
    docSnap = await getDoc(doc(db, appConfig.callDocument, roomIdString));
  } catch (_) {
    return false;
  }
  
  if (docSnap.exists()) {
    return true;
  } else {
    return false;
  }
}

async function onWebcamButtonClick(setShowLocalFeed: LocalFeed, setLocalStream: LocalStream) {

  // create a local media stream object and set it to <video> element
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

  const video = document.getElementById('localStreamHome') as HTMLVideoElement;

  if (video) {
    const startWebcamButton = document.getElementById('startWebcamButton') as HTMLButtonElement;
    startWebcamButton.hidden = true;
    video.srcObject = stream;
    video.hidden = false;
    setShowLocalFeed(true);
    setLocalStream(stream);
  }
}

async function getCallDoc(db: Firestore) {

  // create an empty document inside "calls" collection
  const callDoc = await addDoc(collection(db, appConfig.callDocument), {});
  return callDoc;
}

type LocalFeed = (showLocalFeed: boolean) => void;
type LocalStream = (showLocalFeed: MediaStream | null) => void;

