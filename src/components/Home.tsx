import { FirebaseApp } from "firebase/app";
import { addDoc, collection, Firestore, updateDoc } from "firebase/firestore";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import appConfig from "../app.config";

export default function Home() {

  const navigate = useNavigate();

  const {
    db,
  } = useContext(AppContext);

  // useEffect(() => {
  //   getCallDoc(db)
  //     .then(callDocRef => navigate(`/${callDocRef.id}`));
  // }, [])

  return null;
}

async function getCallDoc(db: Firestore) {

  // create an empty document inside "calls" collection
  const callDoc = await addDoc(collection(db, appConfig.callDocument), {});

  return callDoc;
}

