import adjustVideoGridLayout from "./adjustStreamsLayout";

export default async function removeConnection(remotePeerIdsArray: string[]) {
  if (remotePeerIdsArray.length > 0) {

    remotePeerIdsArray.forEach(async remotePeerId => {

      const remoteVideoElement = document.getElementById(remotePeerId);

      if (remoteVideoElement) {
        
        // get the streams grid element
        const streams = document.getElementById("streams") as HTMLDivElement;

        if (streams) {
          // remove the remote video element and adjust the grid
          streams.removeChild(remoteVideoElement);
          adjustVideoGridLayout(streams.childElementCount, streams);
        }

        // remove the video element
        remoteVideoElement.remove();
      }
    })
  }
}