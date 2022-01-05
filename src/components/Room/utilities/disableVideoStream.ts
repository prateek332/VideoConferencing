export default function disableVideoStream(remotePeerIds: string[]) {
  remotePeerIds.forEach(remotePeerId => {
    const video = document.getElementById(remotePeerId) as HTMLVideoElement;
    if (video) {
      video.srcObject = null;
      video.style.objectFit = "none";
    }
  })
}