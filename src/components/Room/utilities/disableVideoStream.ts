export default function disableVideoStream(remotePeerIds: string[]) {
  remotePeerIds.forEach(remotePeerId => {
    const videoDivElement = document.getElementById(remotePeerId) as HTMLDivElement;
    if (videoDivElement) {
      const videoElement = videoDivElement.firstChild as HTMLVideoElement;
      if (videoElement) {
        videoElement.srcObject = null;
        videoElement.style.objectFit = "none";
      }
    }
  })
}