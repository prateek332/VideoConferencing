import Peer from "peerjs";
import adjustVideoGridLayout from "./adjustStreamsLayout";

import remoteStreamPosterIcon from '../../../assets/icons/remoteStreamPoster.svg';

export default async function connectToNewUser(myPeer: Peer | undefined, remoteUserIds: string[], localStream: MediaStream) {
 
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
            remoteVideoElement.style.objectFit = "cover";
          }
          // if not, create a new remote video element and add it to the grid 
          else {
            newRemoteVideoElement = document.createElement('video');
            newRemoteVideoElement.id = remoteId;
            newRemoteVideoElement.srcObject = remoteUserStream;
            newRemoteVideoElement.poster = remoteStreamPosterIcon;
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