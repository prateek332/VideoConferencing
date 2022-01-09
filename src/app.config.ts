const firebaseConfig = {
  apiKey: "AIzaSyB-WWRWmwpneXpPNTKIXDsJj8CXmWquW8I",
  authDomain: "prateekvideochat.firebaseapp.com",
  projectId: "prateekvideochat",
  storageBucket: "prateekvideochat.appspot.com",
  messagingSenderId: "869116496566",
  appId: "1:869116496566:web:7bde057c33d64d7e0af417",
  measurementId: "G-520FZHWMK2"
};


const servers = {
  iceServers:  [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
}

const mySocialLinks = {
	github: 'https://github.com/prateek332',
	instagram: 'https://www.instagram.com/prateekator/',
	twitter: 'https://www.twitter.com/prateekator',
	portfolio: 'https://prateekinfo.in',
}

const config = {
	'firebaseConfig': firebaseConfig,
	'servers': servers,
	'callDocument': 'calls',
	'newConnections': 'newConnections',
	'removeConnections': 'removeConnections',
	'socialLinks': mySocialLinks,
}

export default Object.freeze(config);