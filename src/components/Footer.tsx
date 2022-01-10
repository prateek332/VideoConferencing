import instagramIcon from '../assets/icons/instagram.svg';
import twitterIcon from '../assets/icons/twitter.svg';
import githubIcon from '../assets/icons/github.svg';
import aboutIcon from '../assets/icons/about.svg';
import { Link } from 'react-router-dom';
import appConfig from '../app.config';

const commonCss = `w-12 h-12 m-4 transition duration-500 ease-in-out transform hover:scale-150 text-center text-xs font-medium`;

export default function Footer() {

  const commonCss = `w-12 h-12 m-4 transition duration-500 ease-in-out transform hover:scale-150 text-center text-xs font-medium`;

  return (
    <div className="flex flex-wrap justify-center items-center">

      {/* portfolio */}
      <a
        href={appConfig.socialLinks.portfolio} target="_blank"
        className={`${commonCss} footer-icon`}
      >
        <img
          src={aboutIcon}
          className="bg-slate-200 rounded-full transform duration-500 hover:rotate-180"
        />
        <p className="footer-icon-text">About Me</p>
      </a>

      {/* twitter */}
      <a
        href={appConfig.socialLinks.twitter} target="_blank"
        className={`${commonCss} footer-icon`}
      >
        <img
          src={twitterIcon}
          className="rounded-full transform duration-500 hover:rotate-180"
        />
        <p className="footer-icon-text">My Twitter</p>
      </a>

      {/* instagram */}
      <a
        href={appConfig.socialLinks.instagram} target="_blank"
        className={`${commonCss} footer-icon`}
      >
        <img
          src={instagramIcon}
          className="rounded-full transform duration-500 hover:rotate-180"
        />
        <p className="footer-icon-text">My Instagram</p>
      </a>

      {/* github */}
      <a
        href={appConfig.socialLinks.github} target="_blank"
        className={`${commonCss} footer-icon`}
      >
        <img
          src={githubIcon}
          className="rounded-full transform duration-500 hover:rotate-180"
        />
        <p className="footer-icon-text">My GitHub</p>
      </a>


    </div>
  )
}