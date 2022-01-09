import { Firestore } from "firebase/firestore";
import Peer from "peerjs";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../App";
import phoneHangupIcon from "../../../assets/icons/phoneHangup.svg";
import MyDialog from '../../Dialog/MyDialog';
import { addDisconnectCallDocument, removeMyPeerIdDocument } from "../utilities/firestoreManipulation";


interface Props {
  myPeer: Peer | undefined;
  myPeerDocId: string;
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
    myPeerDocId,
  } = props;

  // useEffect(() => {
  //   // alert user if they are about to leave the room
  //   window.addEventListener('beforeunload', alertUser);
  //   // handle tab closing
  //   window.addEventListener('unload', handleTabClosing(null, db, myPeer, roomId, username));

  //   return () => {
  //     window.removeEventListener('beforeunload', alertUser);
  //   }
  // }, []);

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
        outsideClickClose={false}
        title="Disconnect call?"
        description={undefined}
        children={undefined}
        submitButton
        submitButtonMessage="Yes"
        submitButtonFunc={() => dialogSubmitButtonFunc(db, myPeer, myPeerDocId, username, roomId, setIsOpen, navigate)}
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
  myPeerDocId: string,
  username: string,
  roomId: string,
  setIsOpen: any, 
  navigate: any
  ) {

  await disconnectMyCall(db, myPeer, myPeerDocId, roomId, username);
  setIsOpen(false);
  navigate('/rating', { state: { roomId: roomId} });
}

async function disconnectMyCall(
  db: Firestore, 
  myPeer: Peer | undefined,
  myPeerDocId: string, 
  roomId: string, 
  username: string
  ) {
  addDisconnectCallDocument(db, roomId, username, myPeer)
    .then(res => {
      if (res == true) {
        removeLocalVideo();
      }
      else
        console.log('cannot disconnect, something went wrong');
    })
  
  removeMyPeerIdDocument(db, roomId, myPeerDocId);
}

async function removeLocalVideo() {
  const localStream = document.getElementById("localStreamRoom") as HTMLVideoElement; 
  if (localStream) {
    localStream.srcObject = null;
    localStream.remove();
  }
}

const alertUser = (event: any) => {
  event.preventDefault();
  event.returnValue="";
}

// const handleTabClosing = (event: any, db: any, myPeer: any, roomId: any, username: any) => {
//   disconnectMyCall(db, myPeer, roomId, username);
// }
