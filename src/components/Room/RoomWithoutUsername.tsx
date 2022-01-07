import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../App";
import MyDialog from "../Dialog/MyDialog";
import { _onRoomIdSubmitUtility } from "../Home";

export default function RoomWithoutUsername() {

  const [roomExists, setRoomExists] = useState(false);
  const [roomExistsMessage, setRoomExistsMessage] = useState("Checking if room exists...");
  
  const {
    setUsername,
    db,
  } = useContext(AppContext);

  // grab reference call document from url
  let urlParams = useParams();

  const [usernameInput, setUsernameInput] = useState(getUsername());
  
  const navigate = useNavigate();
  
  // states for showing dialog
  const [isOpen, setIsOpen] = useState(true);
  const [description, setDescription] = useState("");

  useEffect(() => {
    try {
      _onRoomIdSubmitUtility(db, urlParams.roomId || "")
        .then(roomId => {
          roomId ? 
          setRoomExists(true) :
          roomNotExists(setRoomExistsMessage, navigate);
        })
    } catch (e) {
      console.log(e);
      roomNotExists(setRoomExistsMessage, navigate);
    }

    return(() => {
      clearTimeout();
    })
  }, []);


  const onUsernameSubmit = () => {

    if (usernameInput.length < 5 || usernameInput.length > 20) {
      setDescription("Username must be between 5 and 20 characters");
    } else {
      if (urlParams.roomId) {
        // set username and save it in local storage
        setUsername(usernameInput);
        localStorage.setItem("username", usernameInput);
        // close the dialog and navigate to chat page
        setIsOpen(false);
        navigate(`/${urlParams.roomId}`);
      } else {
        setDescription("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <div className="waves-background flex h-full w-full">
      {
        roomExists ?
            <MyDialog
              isOpen={isOpen}
              outsideClickClose={false}
              title="Enter Username"
              description={description}
              children={inputUsername(usernameInput, setUsernameInput)}
              submitButton
              submitButtonMessage="Submit"
              submitButtonFunc={onUsernameSubmit}
            />
          :
            <MyDialog
            isOpen={isOpen}
            outsideClickClose={false}
            title={roomExistsMessage}
            submitButtonFunc={() => null}
          />
      }
  </div>
  )
}

function inputUsername(usernameInput: string, setUsernameInput: (username: string) => void) {
  return (
    <div className="flex flex-col items-center justify-center">
      <label htmlFor="username" className="text-2xl font-medium text-gray-600">
        Username
      </label>
      <input
        type="text"
        defaultValue={usernameInput}
        onChange={(e) => setUsernameInput(e.target.value)}
        className="mt-1 px-4 py-2 text-sm font-medium text-gray-800 bg-white rounded-md border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75"
        placeholder="Enter username"
      />
    </div>
  )
}

function getUsername(): string {
  const username = localStorage.getItem('username');
  return username ? username : '';
}

function roomNotExists(setRoomExistsMessage: any, navigate: any) {
  setRoomExistsMessage("Room does not exist, navigating back to homepage in 5 secs...");
  setTimeout(() => {
    navigate("/");
  }, 5000);
}