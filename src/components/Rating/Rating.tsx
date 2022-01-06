import { useLocation, useNavigate } from "react-router-dom"

export default function Rating() {

  const navigate = useNavigate();

  let roomId = undefined;
  const { state }: any = useLocation();  
  if (state !== null) {
    roomId = state.roomId;
  }

  return (
    <div className="waves-background w-full h-full flex justify-center items-center">
      {rejoinCall(roomId || "", navigate)}
    </div>
  )
}

function rejoinCall(roomId: string, navigate: any) {
  return (
    <div className="p-4 flex flex-col justify-center items-center border-2 border-amber-200 rounded-3xl">
      <div className="m-2 font-semibold">
        Rejoin the call?
      </div>
      <div>
        <button
          className="p-2 m-2 bg-green-600 text-center font-semibold rounded-2xl border-2 border-green-400 
            transition ease-in hover:scale-110 hover:bg-green-400"
          onClick={() => {
            navigate('/' + roomId);
          }}
        >Rejoin</button>
      </div>
    </div>
  )
}