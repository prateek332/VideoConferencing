import Peer from 'peerjs';
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../App";
import localStreamPosterIcon from '../../assets/icons/localStreamPoster.svg';
import HangupButton from "./HangupButton/HangupButton";
import RoomLinkButton from './RoomLinkButton/RoomLinkButton';
import { addMyPeerDocument } from "./utilities/firestoreManipulation";
import { newConnectionsSnapshotListener, removeConnectionSnapshotListener, stopConnectionSnapshotListener } from "./utilities/snapshots";
import VideoButton from "./VideoButton/VideoButton";


export default function Room() {

  const navigate = useNavigate();

  const {
    db,
    localStream, setLocalStream,
    username,
  } = useContext(AppContext);

  const params = useParams();

  const [myPeer, setMyPeer] = useState<Peer>();
  const [myPeerDocId, setMyPeerDocId] = useState<string>(``);
  const [snapshotSet, setSnapshotSet] = useState(false);
  
  // get local video stream, set it to localStream and display it on the page
  useLayoutEffect(() => {
    if (localStream !== null) {
      addLocalStreamToLocalDiv(localStream);
    } else {
      getLocalVideo()
        .then(stream => {
          setLocalStream(stream);
        })
    }
  }, [localStream]);
  
  // generate peerId and write it to firestore and listen for new connections
  useEffect(() => {

    let newConnUnsubscribe: any, removeConnUnsubscribe: any, stopConnUnsubscribe: any;

    if (localStream !== null) {
      if (params.roomId === undefined || params.roomId === "" || params.roomId === null) {
        // navigate back to home because something is wrong
        navigate("/");
      } else {

        if (!snapshotSet) {
          
          // create a new Peer for this user
          const myNewPeer = new Peer();
          setMyPeer(myNewPeer);
          
          // when peer connected then write details to firestore and setup snapshot listeners
          myNewPeer.on('open', peerId => {
  
            addMyPeerDocument(db, params.roomId as string, username, myNewPeer)
              .then(docRefId => {
                
                if (docRefId.length > 0) {

                  // save the doc ref
                  setMyPeerDocId(docRefId);
    
                  // setup snapshot listeners
                  if (params.roomId !== undefined)  {
    
                    // for new peerIds
                    newConnUnsubscribe = newConnectionsSnapshotListener(db, myNewPeer, params.roomId, localStream);
    
                    // for removing connections
                    removeConnUnsubscribe = removeConnectionSnapshotListener(db, myNewPeer, params.roomId);
    
                    // for stopping connections
                    stopConnUnsubscribe = stopConnectionSnapshotListener(db, myNewPeer, params.roomId);
                  }
  
                } else {
                  console.log("error adding myPeerId document to firestore");
                }
              })
          });
  
          // setup call answering event listener
          myNewPeer.on('call', call => {
            call.answer(localStream);
          })

          // no need to re-run this effect for snapshot listeners
          setSnapshotSet(true);
        }
      }

      return(() => {
        stopConnUnsubscribe();
        removeConnUnsubscribe();
        newConnUnsubscribe();
      })
    }
  }, [localStream]);

  // useLayoutEffect(() => {
  //   const streams = document.getElementById("streams");
  //   if (streams) {
  //     streams.appendChild(getNewVideoElem());
  //     streams.appendChild(getNewVideoElem());
  //     streams.appendChild(getNewVideoElem());
  //     streams.appendChild(getNewVideoElem());
  //     streams.appendChild(getNewVideoElem());
  //     streams.appendChild(getNewVideoElem());
  //     streams.appendChild(getNewVideoElem());
  //     streams.appendChild(getNewVideoElem());
  //     streams.appendChild(getNewVideoElem());
  //     streams.appendChild(getNewVideoElem());
  //     streams.appendChild(getNewVideoElem());
  //     streams.appendChild(getNewVideoElem());
  //   }
  // }, []);

  const getNewVideoElem = () => {
    const newVideoElem = document.createElement('video');
    newVideoElem.src = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
    newVideoElem.muted;
    newVideoElem.play();
    return newVideoElem;
  }

  return (
    <div className="waves-background grid grid-cols-1 grid-rows-6 w-screen h-screen justify-items-center">

       {/* streams */}
      <div
        id="streams"
        className="justify-items-center"
      >
        <div id="localVideoRoomDiv">
          <video autoPlay playsInline poster={localStreamPosterIcon} />
        </div>
      </div>

       {/* controls and share link */}
      <div className="flex flex-wrap justify-center items-center">

        {/* controls => cam_button, hangup_button */}
        <div className="p-2 flex w-56 sm:mr-12 mb-2 justify-between items-center">

          <VideoButton 
            myPeer={myPeer} 
            roomId={params.roomId ? params.roomId : ""} 
            myPeerDocId={myPeerDocId}
            setMyPeerDocId={setMyPeerDocId}
          />

          <HangupButton 
            myPeer={myPeer}
            myPeerDocId={myPeerDocId}
            roomId={params.roomId ? params.roomId : ""} 
          />
          
        </div>

        {/* room share link */}
        <RoomLinkButton />

      </div>

    </div>
  )
}

async function getLocalVideo() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true});
  return stream;
}

function addLocalStreamToLocalDiv(localStream: MediaStream) {
  const localStreamRoomDivElement = document.getElementById('localVideoRoomDiv');
  if (localStreamRoomDivElement) {
    const localVideo = localStreamRoomDivElement.firstChild as HTMLVideoElement;
    localVideo.srcObject = localStream;
    localVideo.muted = true;
  }
}