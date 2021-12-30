import { doc, DocumentReference, onSnapshot, updateDoc } from "firebase/firestore";
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

  const array1 = [1,2,3];
  const array2 = [1,2,3,4,5,6];
  console.log(array2.filter(x => !array1.includes(x)));

  const {
    db,
    localStream, setLocalStream,
    username
  } = useContext(AppContext);

  const [remotePeers, setRemotePeers] = useState<string[]>([]);

  const params = useParams();
  const myPeer = new Peer();
  let videoGrid: HTMLElement | null;
  let myVideo: HTMLVideoElement;

  let callDocRef: DocumentReference;
  if (params.roomId !== undefined) {
    callDocRef = doc(db, appConfig.callDocument, params.roomId);
  } else {
    // navigate to homepage
  }
  

  // useEffect(() => {
  //   myPeer.on('open', id => {
  //     updateDoc(doc(db, `${appConfig.callDocument}/${params.roomId}`), {
  //       [id]: 'just joined',
  //     })
  //     onSnapshot(doc(db, `${appConfig.callDocument}/${params.roomId}`), doc => {
  //       if (doc.data() !== undefined) {
  //         const otherUserIds = Object.keys(doc.data()).filter(key => key !== id);
  //         connectToNewUser(myPeer, otherUserIds[0], myVideo.srcObject as MediaStream, videoGrid);
  //       }
  //     });
  //   })
  // }, []);

  // useLayoutEffect(()=> {
  //   videoGrid = document.getElementById('video-grid');
  //   myVideo = document.createElement('video');
  //   myVideo.muted = true;

  //   navigator.mediaDevices.getUserMedia({
  //     video: true,
  //     audio: true,
  //   }).then(stream => {
  //     addVideoStream(myVideo, stream, videoGrid);

  //     myPeer.on('call', call => {

  //       call.answer(stream);

  //       const video = document.createElement('video');

  //       // call.on('stream', userVideoStream => {
  //       //   addVideoStream(video, userVideoStream, videoGrid);
  //       // })
  //     })

  //   })
  // }, []);

  useEffect(() => {

    if (localStream !== null) {
      myPeer.on('open', peerId => {
        // console.log(peerId);
        // write your username with peerId to the firestore
        updateDoc(callDocRef, {
          [username]: peerId,
        })

        // add snapshot listener to the call document and get all the new userIds
        onSnapshot(callDocRef, doc => {
          const userIds = doc.data();
          if (userIds !== undefined) {
            const otherUserIds = Object.values(userIds).filter(key => key !== peerId);
            const newUserIds = otherUserIds.filter(peerId => !remotePeers.includes(peerId));
            console.log(newUserIds);
          }
        })

      })
    }
  }, [localStream]);


  useLayoutEffect(() => {
    if (localStream !== null) {
      myVideo = document.getElementById("localStreamRoom") as HTMLVideoElement;
      myVideo.srcObject = localStream;
      myVideo.muted = true;
    } else {
      getLocalVideo()
        .then(stream => setLocalStream(stream));
    }
  }, [localStream]);

  return (
    <div className="waves-background flex flex-col md:flex-row flex-wrap justify-center items-center w-full h-full">
       {/* streams */}
      <div className="relative w-full border-2">
        {/* local video */}
        <div className="absolute bottom-0 right-0">
          <video 
            id="localStreamRoom" autoPlay playsInline poster={localStreamPosterIcon}
            className="bg-slate-800 w-52 h-36 sm:w-72 sm:h-48 rounded-full border-4 border-cyan-200 object-fill"
          />
        </div>

        {/* remote videos */}
        <div className="h-full w-full">
          <ul
            id="remote-streams"
            className="flex flex-wrap justify-center items-center"
          >
            <li>
              <video id="remoteStream0" autoPlay playsInline className="w-96 border-2"
                poster="https://cdn.mos.cms.futurecdn.net/y9eRkea8etVcm9Ybksbw4R-1024-80.jpg.webp"/>
            </li>
          </ul>
        </div>

      </div>

       {/* controls */}
      <div>
        <div className="mt-5 flex flex-wrap justify-center">
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
      </div>

      {/* room share link */}
      <div>
        <div className="p-2 mb-5 bg-slate-100 text-blue-800 rounded-2xl border-2">
          <input
            id="shareLink"
            type="text"
            value={'room link'}
            disabled
            className="bg-transparent"
          />

          <button
            onClick={_ => copyToClipboard()}
          >
            <img
              src={copyIcon}
              className="p-1 w-10 h-8 bg-slate-200 rounded-full transition ease-in hover:scale-125"
              alt="copy"
            />
          </button>

        </div>
      </div>

      {/* <div id="video-grid"></div> */}
    </div>
  )
}

function connectToNewUser(myPeer: Peer, userId: string, stream: MediaStream,
   videoGrid: HTMLElement | null) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement('video');
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream, videoGrid);
  })
  call.on('close', () => {
    video.remove();
  })
}

function addVideoStream(video: HTMLVideoElement, stream: MediaStream, 
  videoGrid: HTMLElement | null) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  })
  videoGrid?.append(video);
}

async function getLocalVideo() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true});
  return stream;
}

function copyToClipboard() {
  const shareLinkElement = document.getElementById("shareLink") as HTMLInputElement;
  if (shareLinkElement) {
    navigator.clipboard.writeText(shareLinkElement.value);
  }
}