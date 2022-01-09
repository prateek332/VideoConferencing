import adjustVideoGridLayout from "./adjustStreamsLayout";

export default async function removeConnection(remotePeerIdsArray: string[]) {

  if (remotePeerIdsArray.length > 0) {

    remotePeerIdsArray.forEach(async remotePeerId => {

      const remoteDivElement = document.getElementById(remotePeerId) as HTMLDivElement;

      if (remoteDivElement) {

        // remove the video element inside the remoteDivElement
        remoteDivElement.firstChild?.remove();
        
        // get the streams grid element
        const streamsElem = document.getElementById("streams") as HTMLDivElement;

        if (streamsElem) {
          // remove the remote video element and adjust the grid
          streamsElem.removeChild(remoteDivElement);
          // adjust the grid layout
          adjustVideoGridLayout(streamsElem.childElementCount, streamsElem);
        }
        
      }
    })
  }
}