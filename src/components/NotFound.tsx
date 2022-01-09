import { useLayoutEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {

  const [redirectCount, setRedirectCount] = useState(5);

  const navigate = useNavigate();

  useLayoutEffect(() => {

    if (redirectCount === 0) navigate('/');
    
    else {
      setTimeout(() => {
        setRedirectCount(redirectCount - 1);
      }, 1000);
    }

    return () => {
      clearTimeout();
    }

  });

  return (
    <div className="waves-background h-screen w-screen flex flex-wrap justify-center items-center font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center">

      <div className="flex flex-col flex-wrap justify-between items-center p-4 border-2 rounded-2xl border-amber-300 h-80 md:h-72 w-4/6">

        <div className="border-b-2 border-opacity-40">
          Hi👋🏻
        </div>

        <div className="border-b-2 border-opacity-40">
          I think you're at the wrong place
        </div>

        <div className="border-b-2 border-opacity-40">
          Click 
          <Link to="/" className="text-pink-400 underline underline-offset-4"> here </Link>
          to go back to the home page
          or you'll be redirected in {redirectCount} seconds ...
        </div>
      </div>  

    </div>
  )
}