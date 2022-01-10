import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import Footer from "../Footer";
import StarRating from "./StarRating";

export default function Rating() {

  const {
    username,
  } = useContext(AppContext);

  const navigate = useNavigate();

  // useEffect(() => {
  //   if (username.length === 0) {
  //     navigate('/');
  //   }
  // });

  let roomId = undefined;
  const { state }: any = useLocation();  
  if (state !== null) {
    roomId = state.roomId;
  }

  return (
    <div className="waves-background w-screen h-screen flex flex-col justify-center items-center">
      
      <div className="absolute top-0 w-full flex flex-col flex-wrap justify-center items-center">
        {thankyouMessage()}
        {rejoinCall(roomId || "", navigate)}
      </div>

      {/* footer */}
      <div className="footer">
        <Footer />
      </div>
    </div>
  )
}

function thankyouMessage() {
  return (
    <div className="p-2 m-11 flex flex-col flex-wrap items-center justify-center w-6/12 text-center text-xxl sm:text-3xl md:text-4xl font-semibold">
      <div>
        Thanks for using my app 😊
      </div>
      <div className="my-10">
        Before leaving please leave a rating below
      </div>
      <div className="text-4xl sm:text-6xl">
        <StarRating numberOfStars={5} />
      </div>
      <div className="w-full mt-10 border-b-2 border-opacity-40"></div>
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