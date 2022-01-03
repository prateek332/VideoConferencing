import { addDoc, collection, doc, DocumentReference, Firestore, onSnapshot, query, setDoc, startAfter, updateDoc } from "firebase/firestore";
import { useContext, useEffect, useLayoutEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { AppContext } from "../App";

import cameraIcon from '../assets/icons/camera.svg';
import phoneHangupIcon from '../assets/icons/phoneHangup.svg';
import copyIcon from '../assets/icons/copy.svg';
import localStreamPosterIcon from '../assets/icons/localStreamPoster.svg';
import appConfig from "../app.config";

import Peer from 'peerjs';

export default function Room() {

  const {
    db,
    localStream, setLocalStream,
    username
  } = useContext(AppContext);

  const params = useParams();
  let myPeer: Peer | undefined;
  let videoGrid: HTMLElement | null;  

  // useEffect(() => {
  //   setTimeout(() => testAddMoreRemoteVideos(), 3000)
  //   setTimeout(() => testAddMoreRemoteVideos(), 4000)
  //   setTimeout(() => testAddMoreRemoteVideos(), 5000)
  //   setTimeout(() => testAddMoreRemoteVideos(), 6000)
  //   setTimeout(() => testAddMoreRemoteVideos(), 7000)
  //   setTimeout(() => testAddMoreRemoteVideos(), 8000)
  //   setTimeout(() => testAddMoreRemoteVideos(), 9000)
  //   setTimeout(() => testAddMoreRemoteVideos(), 10000)
  //   setTimeout(() => testAddMoreRemoteVideos(), 11000)
  //   setTimeout(() => testAddMoreRemoteVideos(), 12000)
  //   setTimeout(() => testAddMoreRemoteVideos(), 13000)
  //   setTimeout(() => testAddMoreRemoteVideos(), 14000)
  // }, []);
  
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
  useLayoutEffect(() => {
    if (localStream !== null) {
      if (params.roomId === undefined || params.roomId === "" || params.roomId === null) {
      // navigate back to home cause something is wrong
      } else {

        // create a new Peer for this user
        myPeer = new Peer();
        // open peer connection and write peer to firestore
        myPeer.on('open', peerId => {
          addMyPeerDocument(db, params.roomId as string, username, peerId)
            .then(doc => {
              // if document was added successfully then set a snapshot listener for new remote ids
              if (doc && params.roomId !== undefined)  {
                // setup a snapshot listener for new peerIds
                setRemotePeerSnapshotListener(db, myPeer, params.roomId, localStream);
              } else {
                console.log("error adding myPeerId to firestore document");
              }
            })
        });

        // whenever we receive a call, we answer back with out localStream MediaStream
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
              <button id="camButton">
                <img src={cameraIcon} className="w-12 h-10" alt="camera"/>
              </button>
            </div>
            <div className="p-1 bg-red-500 rounded-full transition ease-in-out hover:scale-125">
              <button id="hangupButton">
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

function testAddMoreRemoteVideos() {
  const streams = document.getElementById("streams") as HTMLDivElement;
  if (streams) {
    const video = document.createElement("video") as HTMLVideoElement;

    video.src = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
    video.muted = true;
    video.loop = true;
    video.play();
    // video.setAttribute('class', allVideosStyle);

    streams.appendChild(video);
    
    adjustVideoGridLayout(streams.childElementCount, streams);
  }
}

async function addMyPeerDocument(db: Firestore, roomId: string, username: string,  myPeerId: string) {

  const {
    callDocument,
    newConnections: newConnectionsDoc,
  } = appConfig

  const docRef = await addDoc(collection(db, callDocument, roomId, newConnectionsDoc ), {
    [username]: myPeerId,
  });

  return docRef !== undefined ? true : false;
}

function setRemotePeerSnapshotListener(db: Firestore, myPeer: Peer | undefined, roomId: string, localStream: MediaStream) {
  if (myPeer) {
    const q = query(collection(db, appConfig.callDocument, roomId, appConfig.newConnections));
    const unsubscribe = onSnapshot(q, async snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          const remotePeerIdsArray = Object.values(change.doc.data()).filter(value => value !== myPeer.id);
          connectToNewUser(myPeer, remotePeerIdsArray, localStream);
        }
      })
    })
  } else {
    console.log('myPeer is undefined');
  }
}

async function connectToNewUser(myPeer: Peer | undefined, remoteUserIds: string[], localStream: MediaStream) {
 
  if (myPeer) {

    const streams = document.getElementById('streams') as HTMLDivElement;
    
    if (streams !== null) {

      remoteUserIds.forEach(remoteId => {

        const call = myPeer.call(remoteId, localStream);

        const newRemoteVideo = document.createElement('video');
        
        call.on('stream', remoteUserStream => {
          newRemoteVideo.srcObject = remoteUserStream;
          newRemoteVideo.addEventListener('loadedmetadata', () => {
            newRemoteVideo.play();
          })
          adjustVideoGridLayout(streams.childElementCount + 1, streams);
          streams.appendChild(newRemoteVideo);
        });

        call.on('close', () => {
          if (newRemoteVideo) {
            newRemoteVideo.remove();
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
      if (numberOfElem > 2)
        _adjustStreamsGridUtility(numberOfElem, screenWidth, streams);
      break;
    }

    // md adjustments
    default: {
      if (numberOfElem > 1) 
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