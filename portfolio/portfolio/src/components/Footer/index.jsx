import { Link, NavLink } from 'react-router-dom'
import './index.scss'
import LogoS from '../../assets/images/logo-s.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGithub,
  faInstagram,
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons'

const Footer = () => (
  <div className="footer">
    <ul>
      <li>
        <a
          target="blank"
          rel="nonreferrer"
          href="https://www.linkedin.com/in/siphamandla-m-mahlangu-07b22b268?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
        >
          <FontAwesomeIcon icon={faLinkedin} color="#4d4d4e" />
        </a>
      </li>
      <li>
        <a target="blank" rel="nonreferrer" href="">
          <FontAwesomeIcon icon={faGithub} color="#4d4d4e" />
        </a>
      </li>
      <li>
        <a target="blank" rel="nonreferrer" href="">
          <FontAwesomeIcon icon={faInstagram} color="#4d4d4e" />
        </a>
      </li>
    </ul>
  </div>
)
export default Footer
