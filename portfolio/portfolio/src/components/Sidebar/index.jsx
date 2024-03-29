import { Link, NavLink } from 'react-router-dom'
import './index.scss'
import LogoS from '../../assets/images/Logo-n.png'
import LogoSubtitle from '../../assets/images/logo-s.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faHome, faUser } from '@fortawesome/free-solid-svg-icons'
import {
  faGithub,
  faInstagram,
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons'

const Sidebar = () => (
  <div className="nav-bar">
    <Link className="logo" to="/">
      <img src={LogoS} alt="logo"></img>
      {/* <img className="sub-logo" src={LogoSubtitle} alt="logo"></img> */}
    </Link>
    <nav>
      <NavLink exact="true" activeclassname="active" to="/">
        {/* <FontAwesomeIcon icon={faHome} color="#4d4d4e" /> */}
        HOME
      </NavLink>
      <NavLink
        exact="true"
        activeclassname="active"
        className="about-link"
        to="/about"
      >
        {/* <FontAwesomeIcon icon={faUser} color="#4d4d4e" /> */}
        ABOUT
      </NavLink>
      <NavLink
        exact="true"
        activeclassname="active"
        className="contact-link"
        to="/contact"
      >
        CONTACT
        {/* <FontAwesomeIcon icon={faEnvelope} color="#4d4d4e" /> */}
      </NavLink>
      <NavLink
        exact="true"
        activeclassname="active"
        className="projects-link"
        to="/projects"
      >
        PROJECTS
        {/* <FontAwesomeIcon icon={faEnvelope} color="#4d4d4e" /> */}
      </NavLink>
    </nav>
    {/* <ul>
      <li>
        <a target="blank" rel="nonreferrer" href="">
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
    </ul> */}
  </div>
)
export default Sidebar
