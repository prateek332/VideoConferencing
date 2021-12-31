import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../App";
import MyDialog from "./Dialog/MyDialog";

export default function RoomWithoutUsername() {
  
  const {
    username, setUsername,
  } = useContext(AppContext);

  // grab reference call document from url
  let urlParams = useParams();

  const [usernameInput, setUsernameInput] = useState(username);
  
  const navigate = useNavigate();
  
  // states for showing dialog
  const [isOpen, setIsOpen] = useState(true);
  const [description, setDescription] = useState(""); 


  const onUsernameSubmit = () => {

    if (usernameInput.length < 5 || usernameInput.length > 20) {
      setDescription("Username must be between 5 and 20 characters");
    } else {
      if (urlParams.roomId) {
        // create a document reference and set it to callDocRef
        setUsername(usernameInput);
        // close the dialog and navigate to chat page
        setIsOpen(false);
        navigate(`/${urlParams.roomId}`);
        // navigate(`/`);

      } else {
        setDescription("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <div className="waves-background flex flex-col md:flex-row flex-wrap justify-center items-center md:h-full">
      <div className="fixed inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          Open dialog
        </button>
      </div>
      <MyDialog 
        isOpen={isOpen} 
        closeDialog={onUsernameSubmit}
        title="Enter Username"
        description={description}
        children={inputUsername(username, setUsernameInput)}
        buttonMessage="Submit"
      />
  </div>
  )
}

function inputUsername(username: string, setUsernameInput: (username: string) => void) {
  return (
    <div className="flex flex-col items-center justify-center">
      <label htmlFor="username" className="text-sm font-medium text-gray-600">
        Username
      </label>
      <input
        type="text"
        defaultValue={username}
        onChange={(e) => setUsernameInput(e.target.value)}
        className="mt-1 px-4 py-2 text-sm font-medium text-gray-800 bg-white rounded-md border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75"
        placeholder="Enter username"
      />
    </div>
  )
}