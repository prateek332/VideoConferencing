import { collection, Firestore, onSnapshot, query } from "firebase/firestore";
import Peer from "peerjs";
import appConfig from "../../../app.config";
import connectToNewUser from "./connectToNewUser";
import disableVideoStream from "./disableVideoStream";
import removeConnection from "./removeConnection";

function newConnectionsSnapshotListener(db: Firestore, myPeer: Peer | undefined, roomId: string, localStream: MediaStream) {
  if (myPeer) {
    const q = query(collection(db, appConfig.callDocument, roomId, appConfig.newConnections));
    const unsubscribe = onSnapshot(q, async snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          const remotePeerIdsArray = Object.values(change.doc.data());
          connectToNewUser(myPeer, remotePeerIdsArray, localStream);
        }
      })
    })
  } else {
    console.log('myPeer is undefined');
  }
}

function removeConnectionSnapshotListener(db: Firestore, myPeer:Peer | undefined, roomId: string) {
  if (myPeer) {
    const q = query(collection(db, appConfig.callDocument, roomId, appConfig.removeConnections));
    const unsubscribe = onSnapshot(q, async snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          const remotePeerIdsArray = Object.values(change.doc.data());
          removeConnection(remotePeerIdsArray);
        }
      })
    })
  } else {
    console.log('myPeer is undefined. cannot remove connection');
  }
}

function stopConnectionSnapshotListener(db: Firestore, myPeer: Peer | undefined, roomId: string) {
  if (myPeer) {
    const q = query(collection(db, appConfig.callDocument, roomId, appConfig.newConnections));
    const unsubscribe = onSnapshot(q, async snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type == 'removed') {
          const remotePeerIdsArray = Object.values(change.doc.data());
          disableVideoStream(remotePeerIdsArray);
        }
      })
    })
  }
}

export {
  newConnectionsSnapshotListener,
  removeConnectionSnapshotListener,
  stopConnectionSnapshotListener,
}