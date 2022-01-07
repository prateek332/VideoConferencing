import { Firestore } from 'firebase/firestore';
import Peer from 'peerjs';
import { useContext, useState } from 'react';
import { AppContext } from '../../../App';
import { addMyPeerDocument, removeMyPeerIdDocument } from '../utilities/firestoreManipulation';

import cameraIcon from '../../../assets/icons/camera.svg';
import micIcon from '../../../assets/icons/mic.svg';

const commonButtonStyle = "p-2 w-28 flex justify-between rounded-3xl transition ease-in hover:scale-110"
const greenButtonStyle = "bg-green-500 hover:bg-green-400"
const redButtonStyle = "bg-red-500 hover:bg-red-400"

interface Props {
  myPeer: Peer | undefined;
  roomId: string,
  myPeerDocId: string,
  setMyPeerDocId: any,
}

export default function VideoButton(props: Props) {

  const {
    db,
    localStream,
    username,
  } = useContext(AppContext);

  const [stopMyStream, setStopMyStream] = useState(false);
  const [toggleButtonStyle, setToggleButtonStyle] = useState(true);

  const {
    myPeer,
    roomId,
    myPeerDocId,
    setMyPeerDocId
  } = props;
  
  return (
    <div>
      <button 
        id="camButton"
        className={`${commonButtonStyle} ${toggleButtonStyle ? greenButtonStyle : redButtonStyle}`}
        onClick={() =>{
            disableMyStream(db, myPeer, roomId, username,
              myPeerDocId, setMyPeerDocId, stopMyStream, setStopMyStream);
            toggleLocalStream(localStream);
            setToggleButtonStyle(!toggleButtonStyle);
          }
        }
      >
        <img src={micIcon} className="w-10 h-10" alt="camera"/>
        <img src={cameraIcon} className="w-10 h-10" alt="camera"/>
      </button>
    </div>
  )
}

function disableMyStream(
  db: Firestore,
  myPeer: Peer | undefined,
  roomId: string,
  username: string,
  myPeerDocId: string,
  setMyPeerDocId: any,
  stopMyStream: boolean,
  setStopMyStream: any,
) {
  if (myPeer !== undefined && roomId !== undefined && myPeerDocId.length > 0) {
    if (stopMyStream) {
      // enable my stream
      addMyPeerDocument(db, roomId, username, myPeer)
        .then(docRefId => {
          if (docRefId.length > 0) {
            setMyPeerDocId(docRefId);
          } else {
            console.log("error adding myPeerId document to firestore");
          }
        })
    } else {
      // disable my stream
      removeMyPeerIdDocument(db, roomId, myPeerDocId);
    }

    setStopMyStream(!stopMyStream);
  } 
}

function toggleLocalStream(localStream: MediaStream | null) {
  const localVideo = document.getElementById("localStreamRoom") as HTMLVideoElement;
  if (localVideo.srcObject !== null) {
    localVideo.srcObject = null;
    localVideo.style.objectFit = "none";
  } else {
    localVideo.srcObject = localStream;
    localVideo.style.objectFit = "cover";
  }
}