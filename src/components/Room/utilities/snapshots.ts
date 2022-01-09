import { collection, Firestore, onSnapshot, query } from "firebase/firestore";
import Peer from "peerjs";
import appConfig from "../../../app.config";
import connectToNewUser from "./connectToNewUser";
import disableVideoStream from "./disableVideoStream";
import removeConnection from "./removeConnection";

function newConnectionsSnapshotListener(db: Firestore, myPeer: Peer | undefined, roomId: string, localStream: MediaStream) {
  let unsubscribe;
  if (myPeer) {
    const q = query(collection(db, appConfig.callDocument, roomId, appConfig.newConnections));
    unsubscribe = onSnapshot(q, async snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          const remotePeerIdsArray = Object.values(change.doc.data()).filter(remotePeerId => remotePeerId !== myPeer.id);
          connectToNewUser(myPeer, remotePeerIdsArray, localStream);
        }
      })
    })
  } else {
    console.log('myPeer is undefined');
  }
  return unsubscribe;
}

function removeConnectionSnapshotListener(db: Firestore, myPeer:Peer | undefined, roomId: string) {
  let unsubscribe;
  if (myPeer) {
    const q = query(collection(db, appConfig.callDocument, roomId, appConfig.removeConnections));
    unsubscribe = onSnapshot(q, async snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          const remotePeerIdsArray = Object.values(change.doc.data()).filter(remotePeerId => remotePeerId !== myPeer.id);
          removeConnection(remotePeerIdsArray);
        }
      })
    })
  } else {
    console.log('myPeer is undefined. cannot remove connection');
  }
  return unsubscribe;
}

function stopConnectionSnapshotListener(db: Firestore, myPeer: Peer | undefined, roomId: string) {
  let unsubscribe;
  if (myPeer) {
    const q = query(collection(db, appConfig.callDocument, roomId, appConfig.newConnections));
    unsubscribe = onSnapshot(q, async snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type == 'removed') {
          const remotePeerIdsArray = Object.values(change.doc.data()).filter(remotePeerId => remotePeerId !== myPeer.id);
          disableVideoStream(remotePeerIdsArray);
        }
      })
    })
  }
  return unsubscribe;
}

export {
  newConnectionsSnapshotListener,
  removeConnectionSnapshotListener,
  stopConnectionSnapshotListener,
};
