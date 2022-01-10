import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import copyIcon from '../../../assets/icons/copy.svg';
import MyDialog from '../../Dialog/MyDialog';

export default function RoomLinkButton() {

  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    return () => {
      clearTimeout();
    }
  })

  return (
    <div className="flex p-2 h-10 text-xl bg-slate-100 text-blue-800 rounded-2xl">
      <input 
        id="shareLink" type="text" readOnly
        value={`${window.location.origin}/${params.roomId}`}
        className="bg-transparent cursor-pointer font-thin text-gray-500"
        onClick={() => {
          setIsOpen(true);
          copyToClipboard(); 
          setTimeout(() => setIsOpen(false), 700);
        }}
      />

      <button onClick={() => { 
          setIsOpen(true);
          copyToClipboard(); 
          setTimeout(() => setIsOpen(false), 700);
        }}
      >
        <img
          src={copyIcon}
          className="w-full h-full bg-slate-200 transition ease-in hover:scale-125 hover:bg-pink-300 rounded-sm"
          alt="copy"
        />
      </button>

      <MyDialog
        isOpen={isOpen}
        title="Link Copied✅"
        outsideClickClose={true}
        submitButtonFunc={() => null}
      />

    </div>
  )
}

function copyToClipboard() {
  const shareLinkElement = document.getElementById("shareLink") as HTMLInputElement;
  if (shareLinkElement) {
    navigator.clipboard.writeText(shareLinkElement.value);
  }
}