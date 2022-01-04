import { addDoc, collection, doc, DocumentReference, Firestore, onSnapshot, query, setDoc, startAfter, updateDoc } from "firebase/firestore";
import { useContext, useEffect, useLayoutEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AppContext } from "../App";

import cameraIcon from '../assets/icons/camera.svg';
import phoneHangupIcon from '../assets/icons/phoneHangup.svg';
import copyIcon from '../assets/icons/copy.svg';
import localStreamPosterIcon from '../assets/icons/localStreamPoster.svg';
import appConfig from "../app.config";

import Peer from 'peerjs';

export default function Room() {

  const navigate = useNavigate();

  const {
    db,
    localStream, setLocalStream,
    username
  } = useContext(AppContext);

  const params = useParams();
  let myPeer: Peer | undefined;
  
  // get local video stream, set it to localStream and display it on the page
  useLayoutEffect(() => {
    
    if (localStream !== null) {
      const myVideo = document.getElementById("localStreamRoom") as HTMLVideoElement;
      myVideo.srcObject = localStream;
      myVideo.muted = true;
    } else {
      getLocalVideo()
        .then(stream => {
          setLocalStream(stream);
        })
    }
  }, [localStream]);
  
  // generate peerId and write it to firestore and listen for new connections
  useEffect(() => {
    if (localStream !== null) {
      if (params.roomId === undefined || params.roomId === "" || params.roomId === null) {
        // navigate back to home cause something is wrong
        navigate("/");
      } else {

        // create a new Peer for this user
        myPeer = new Peer();
        
        // when peer connected then write details to firestore and setup snapshot listeners
        myPeer.on('open', peerId => {

          addMyPeerDocument(db, params.roomId as string, username, myPeer)
            .then(doc => {

              // if document was added successfully then set a snapshot listeners
              if (doc && params.roomId !== undefined)  {

                // setup a snapshot listener for new peerIds
                setNewConnectionsSnapshotListener(db, myPeer, params.roomId, localStream);

                // setup a snapshot listener for removing connections
                setRemoveConnectionSnapshotListener(db, myPeer, params.roomId);

              } else {
                console.log("error adding myPeerId document to firestore");
              }
            })
        });

        // setup call answering event listener
        myPeer.on('call', call => {
          call.answer(localStream);
        })

      }
    }

  }, [localStream]);

  return (
    <div className="waves-background grid grid-cols-1 grid-rows-6 w-full h-full justify-items-center">

       {/* streams */}
      <div
        id="streams"
      >
        <video
          id="localStreamRoom" autoPlay playsInline poster={localStreamPosterIcon}
        />
      </div>

       {/* controls and share link */}
      <div className="flex flex-wrap justify-center items-center">

        {/* controls => cam_button, hangup_button */}
        <div className="flex flex-wrap justify-center m-4">
          {/* camera, hangup */}
          <div className="w-full sm:w-56 md:w-64 flex justify-evenly items-center mb-3">
            <div className="p-1 bg-green-500 rounded-full transition ease-in-out hover:scale-125">
              <button 
                id="camButton"
                onClick={() => null}
              >
                <img src={cameraIcon} className="w-12 h-10" alt="camera"/>
              </button>
            </div>
            <div className="p-1 bg-red-500 rounded-full transition ease-in-out hover:scale-125">
              <button 
                id="hangupButton"
                onClick={() => disconnectMyCall(db, myPeer, params.roomId as string, username, navigate)}
              >
                <img src={phoneHangupIcon} className="w-12 h-10" alt="hangup"/>
              </button>
            </div>
          </div>
        </div>

        {/* room share link */}
        <div className="flex p-2 text-xl bg-slate-100 text-blue-800 rounded-2xl">
          <input 
            id="shareLink" type="text" readOnly
            value={`${window.location.origin}/${params.roomId}`}
            className="bg-transparent"
          />

          <button onClick={_ => copyToClipboard()} className="p-1">
            <img
              src={copyIcon}
              className="w-full h-full bg-slate-200 transition ease-in hover:scale-125"
              alt="copy"
            />
          </button>
        </div>

      </div>

    </div>
  )
}

async function getLocalVideo() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true});
  return stream;
}

async function removeLocalVideo() {
  const localStream = document.getElementById("localStreamRoom") as HTMLVideoElement; 
  localStream.srcObject = null;
  localStream.remove();
}

function disconnectMyCall(db: Firestore, myPeer: Peer | undefined, roomId: string, username: string, navigate: any) {
  addDisconnectCallDocument(db, roomId, username, myPeer)
    .then(res => {
      if (res == true) {
        removeLocalVideo();
        navigate('/');
      }
      else
        console.log('cannot disconnect, something went wrong');
    })
}

async function addMyPeerDocument(db: Firestore, roomId: string, username: string,  myPeer: Peer | undefined) {

  if (myPeer === undefined) return false;

  const {
    callDocument,
    newConnections: newConnectionsDoc,
  } = appConfig

  const docRef = await addDoc(collection(db, callDocument, roomId, newConnectionsDoc ), {
    [username]: myPeer.id,
  });

  return docRef !== undefined ? true : false;
}

function setNewConnectionsSnapshotListener(db: Firestore, myPeer: Peer | undefined, roomId: string, localStream: MediaStream) {
  if (myPeer) {
    const q = query(collection(db, appConfig.callDocument, roomId, appConfig.newConnections));
    const unsubscribe = onSnapshot(q, async snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          const remotePeerIdsArray = Object.values(change.doc.data());
          connectToNewUser(myPeer, remotePeerIdsArray, localStream);
        }
      })
    })
  } else {
    console.log('myPeer is undefined');
  }
}

async function addDisconnectCallDocument(db: Firestore, roomId: string, username: string, myPeer: Peer | undefined) {

  if (myPeer === undefined) return false;

  const {
    callDocument,
    removeConnections: removeConnectionsDoc,
  } = appConfig

  const docRef = await addDoc(collection(db, callDocument, roomId, removeConnectionsDoc ), {
    [username]: myPeer.id,
  });
  return docRef !== undefined ? true : false;
}

function setRemoveConnectionSnapshotListener(db: Firestore, myPeer:Peer | undefined, roomId: string) {
  if (myPeer) {
    const q = query(collection(db, appConfig.callDocument, roomId, appConfig.removeConnections));
    const unsubscribe = onSnapshot(q, async snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          const remotePeerIdsArray = Object.values(change.doc.data());
          removeConnection(remotePeerIdsArray);
        }
      })
    })
  } else {
    console.log('myPeer is undefined. cannot remove connection');
  }
}

async function removeConnection(remotePeerIdsArray: string[]) {
  if (remotePeerIdsArray.length > 0) {

    remotePeerIdsArray.forEach(async remotePeerId => {

      const remoteVideoElement = document.getElementById(remotePeerId);

      if (remoteVideoElement) {
        
        // get the streams grid element
        const streams = document.getElementById("streams") as HTMLDivElement;

        if (streams) {
          // remove the remote video element and adjust the grid
          streams.removeChild(remoteVideoElement);
          adjustVideoGridLayout(streams.childElementCount, streams);
        }

        // remove the video element
        remoteVideoElement.remove();
      }
    })
  }
}

async function connectToNewUser(myPeer: Peer | undefined, remoteUserIds: string[], localStream: MediaStream) {
 
  if (myPeer) {

    const streams = document.getElementById('streams') as HTMLDivElement;
    
    if (streams !== null) {

      remoteUserIds.forEach(remoteId => {

        const call = myPeer.call(remoteId, localStream);

        let newRemoteVideoElement: HTMLVideoElement;

        call.on('stream', remoteUserStream => {
          
          // check to see if user already has a video element
          const remoteVideoElement = document.getElementById(remoteId) as HTMLVideoElement;
          if (remoteVideoElement) {
            remoteVideoElement.srcObject = remoteUserStream;
          }
          // if not, create a new remote video element and add it to the grid 
          else {
            newRemoteVideoElement = document.createElement('video');
            newRemoteVideoElement.id = remoteId;
            newRemoteVideoElement.srcObject = remoteUserStream;
            newRemoteVideoElement.addEventListener('loadedmetadata', () => {
              newRemoteVideoElement.play();
            })
            // append the new remote video element to the grid
            streams.appendChild(newRemoteVideoElement);
            adjustVideoGridLayout(streams.childElementCount, streams);
          }
        });

        // remove the remote video element when the call is ended
        call.on('close', () => {
          if (newRemoteVideoElement !== undefined && newRemoteVideoElement !== null) {
            newRemoteVideoElement.remove();
            adjustVideoGridLayout(streams.childElementCount, streams);
          }
        });

      })
    }

  }
}

function adjustVideoGridLayout(numberOfElem: number, streams: HTMLDivElement) {

  const screenWidth = window.innerWidth;

  switch(true) {

    // sm adjustments
    case screenWidth <= 768: {
      _adjustStreamsGridUtility(numberOfElem, screenWidth, streams);
      break;
    }

    // md adjustments
    default: {
      _adjustStreamsGridUtility(numberOfElem, screenWidth, streams);
      break;
    }
  }
}

function _adjustStreamsGridUtility(numberOfElem: number, screenWidth: number, streams: HTMLDivElement) {
  let col = 2, row = 1;
  let incrementCol = false;
  for (let i = 2; ; i++) {
    const diff = col * row - numberOfElem;
    if (diff >= 0) break;
    else {
      incrementCol ? col +=1 : row += 1;
      incrementCol = !incrementCol;
    }
  }

  switch(true) {
    case screenWidth <= 768: {
      if (col > 3) col = 3;
      streams.style.gridTemplateColumns = `repeat(${col}, 1fr)`;
      break;
    }
    default: {
      streams.style.gridTemplateColumns = `repeat(${col}, 1fr)`;
      break;
    }
  }
}

function copyToClipboard() {
  const shareLinkElement = document.getElementById("shareLink") as HTMLInputElement;
  if (shareLinkElement) {
    navigator.clipboard.writeText(shareLinkElement.value);
  }
}