import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useContext, useEffect, useLayoutEffect } from "react"
import { useParams } from "react-router-dom"
import { AppContext } from "../App";
import appConfig from "../app.config";

import Peer from 'peerjs';

export default function Room() {

  const params = useParams();
  const myPeer = new Peer();
  let videoGrid: HTMLElement | null;
  let myVideo: HTMLVideoElement;

  const {
    db,
  } = useContext(AppContext);

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

  useLayoutEffect(()=> {
    videoGrid = document.getElementById('video-grid');
    myVideo = document.createElement('video');
    myVideo.muted = true;

    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    }).then(stream => {
      addVideoStream(myVideo, stream, videoGrid);

      myPeer.on('call', call => {

        call.answer(stream);

        const video = document.createElement('video');

        // call.on('stream', userVideoStream => {
        //   addVideoStream(video, userVideoStream, videoGrid);
        // })
      })

    })
  }, []);

  return (
    <div>
      <h1>Room</h1>
      <div id="video-grid"></div>
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