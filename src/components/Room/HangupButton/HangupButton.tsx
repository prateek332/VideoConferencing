import { Firestore } from "firebase/firestore";
import Peer from "peerjs";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../App";
import phoneHangupIcon from "../../../assets/icons/phoneHangup.svg";
import { addDisconnectCallDocument } from "../utilities/firestoreManipulation";

import MyDialog from '../../Dialog/MyDialog';

interface Props {
  myPeer: Peer | undefined;
  roomId: string;
}

export default function HangupButton(props: Props) {

  const navigate = useNavigate();

  // confirmation dialog state
  const [isOpen, setIsOpen] = useState(false);

  const {
    db,
    username,
  } = useContext(AppContext);

  const {
    myPeer,
    roomId,
  } = props;

  return (
    <div>
      <button 
        id="hangupButton"
        className="p-1 h-14 bg-red-500 rounded-full transition ease-in hover:scale-110 hover:bg-red-400"
        onClick={() => setIsOpen(true)}
      >
        <img src={phoneHangupIcon} className="w-12 h-10" alt="hangup"/>
      </button>
      <MyDialog
        isOpen={isOpen}
        outsideClickClose={true}
        title="Disconnect call?"
        description={undefined}
        children={undefined}
        submitButton
        submitButtonMessage="Yes"
        submitButtonFunc={() => dialogSubmitButtonFunc(db, myPeer, username, roomId, setIsOpen, navigate)}
        cancelButton
        cancelButtonMessage="No"
        cancelButtonFunc={() => setIsOpen(false)}
      />
    </div>
  )
}

async function dialogSubmitButtonFunc(
  db: Firestore, 
  myPeer: Peer | undefined,
  username: string,
  roomId: string,
  setIsOpen: any, 
  navigate: any
  ) {

  await disconnectMyCall(db, myPeer, roomId, username);
  navigate('/rating', { state: { roomId: roomId} });
  setIsOpen(false);

}

async function disconnectMyCall(db: Firestore, myPeer: Peer | undefined, roomId: string, username: string) {
  addDisconnectCallDocument(db, roomId, username, myPeer)
    .then(res => {
      if (res == true) {
        removeLocalVideo();
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
