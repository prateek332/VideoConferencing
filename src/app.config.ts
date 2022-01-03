const firebaseConfig = {
	apiKey: "AIzaSyA_h8hLD8dKmeR4Y3GuqO_POCiINEa0Nkc",
	authDomain: "resumeprojectsprateek.firebaseapp.com",
	projectId: "resumeprojectsprateek",
	storageBucket: "resumeprojectsprateek.appspot.com",
	messagingSenderId: "658186952127",
	appId: "1:658186952127:web:4600361e39e947886b550a"
}

const servers = {
  iceServers:  [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
}

const config = {
	'firebaseConfig': firebaseConfig,
	'servers': servers,
	'callDocument': 'calls',
	'newConnections': 'newConnections',
	'noOfRemoteStreams': 1,
}

export default Object.freeze(config);