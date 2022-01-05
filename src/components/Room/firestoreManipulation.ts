import { addDoc, collection, DocumentReference, Firestore } from "firebase/firestore";
import Peer from "peerjs";
import appConfig from "../../app.config";

async function addMyPeerDocument(db: Firestore, roomId: string, username: string,  myPeer: Peer | undefined){

  if (myPeer === undefined) return undefined;

  const {
    callDocument,
    newConnections: newConnectionsDoc,
  } = appConfig

  const docRef = await addDoc(collection(db, callDocument, roomId, newConnectionsDoc ), {
    [username]: myPeer.id,
  });

  return docRef;
}

async function addDisconnectCallDocument(db: Firestore, roomId: string, username: string, myPeer: Peer | undefined) {

  if (myPeer === undefined) return false;

  const {
    callDocument,
    removeConnections: removeConnectionsDoc,
  } = appConfig

  const docRef = await addDoc(collection(db, callDocument, roomId, removeConnectionsDoc ), {
    [username]: myPeer.id,
  });
  return docRef !== undefined ? true : false;
}

export {
  addMyPeerDocument,
  addDisconnectCallDocument,
}

async function removeMyPeerId(db: Firestore, roomId: string, docRefId: string) {
  
}