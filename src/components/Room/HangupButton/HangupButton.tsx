import { Firestore } from "firebase/firestore";
import Peer from "peerjs";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../App"

import phoneHangupIcon from "../../../assets/icons/phoneHangup.svg";
import { addDisconnectCallDocument } from "../utilities/firestoreManipulation";

interface Props {
  myPeer: Peer | undefined;
  roomId: string;
}

export default function HangupButton(props: Props) {

  const navigate = useNavigate();

  const {
    db,
    username,
  } = useContext(AppContext);

  const {
    myPeer,
    roomId,
  } = props;

  return (
    <div className="p-1 bg-red-500 rounded-full transition ease-in-out hover:scale-125">
      <button 
        id="hangupButton"
        onClick={() => disconnectMyCall(db, myPeer, roomId, username, navigate)}
      >
        <img src={phoneHangupIcon} className="w-12 h-10" alt="hangup"/>
      </button>
    </div>
  )
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

async function removeLocalVideo() {
  const localStream = document.getElementById("localStreamRoom") as HTMLVideoElement; 
  localStream.srcObject = null;
  localStream.remove();
}
