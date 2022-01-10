import Peer from "peerjs";
import remoteStreamPosterIcon from '../../../assets/icons/remoteStreamPoster.svg';
import adjustVideoGridLayout from "./adjustStreamsLayout";


export default async function connectToNewUser(myPeer: Peer | undefined, remoteUserIds: string[], localStream: MediaStream) {
 
  if (myPeer) {

    const streamsElem = document.getElementById('streams') as HTMLDivElement;
    
    if (streamsElem !== null) {

      remoteUserIds.forEach(remoteId => {

        // call new user and give them our local media stream
        const call = myPeer.call(remoteId, localStream);

        // these variables are used when a fresh new user connects to the room
        let newRemoteDivElement: HTMLDivElement;
        let newRemoteVideoElement: HTMLVideoElement;

        // when new user reply, they will send us their media stream
        call.on('stream', remoteUserStream => {
          
          // check to see if user already has a video element
          const remoteDivElement = document.getElementById(remoteId) as HTMLDivElement;

          if (remoteDivElement) {
            const remoteVideoElement = remoteDivElement.firstChild as HTMLVideoElement;
            remoteVideoElement.srcObject = remoteUserStream;
            remoteVideoElement.style.objectFit = 'cover';
          }
          // if not, create a new remote video element and add it to the grid
          else {
            newRemoteDivElement = document.createElement('div');
            newRemoteDivElement.id = remoteId;
            
            newRemoteVideoElement = document.createElement('video');
            newRemoteVideoElement.srcObject = remoteUserStream;
            newRemoteVideoElement.poster = remoteStreamPosterIcon;
            newRemoteVideoElement.addEventListener('loadedmetadata', () => {
              newRemoteVideoElement.play();
            })

            // append the new remote video element to the grid
            newRemoteDivElement.appendChild(newRemoteVideoElement);
            streamsElem.appendChild(newRemoteDivElement);

            // adjust the grid layout
            adjustVideoGridLayout(streamsElem.childElementCount, streamsElem);
          }
        });

        // remove the remote video element when the call is ended
        call.on('close', () => {
          console.log('peer closed');
          if (newRemoteDivElement) {

            // remove the remote video element from the grid
            newRemoteDivElement.firstChild?.remove();
            newRemoteDivElement.remove();

            // adjust the grid layout
            adjustVideoGridLayout(streamsElem.childElementCount, streamsElem);
            
          }
        });

      })
    }

  }
}