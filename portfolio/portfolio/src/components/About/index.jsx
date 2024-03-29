import { useEffect, useState } from 'react'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCss3,
  faGitAlt,
  faHtml5,
  faJsSquare,
  faNode,
  faReact,
} from '@fortawesome/free-brands-svg-icons'
import Loader from 'react-loaders'

const About = () => {
  const [letterClass, setLetterClass] = useState('text-animate')

  useEffect(() => {
    setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, 2000)
  }, [])

  return (
    <>
      <div className="container about-page">
        <div className="text-zone">
          <h1>
            <AnimatedLetters
              letterClass={letterClass}
              strArray={['A', 'b', 'o', 'u', 't', ' ', 'M', 'e']}
              idx={15}
            ></AnimatedLetters>
          </h1>
          <p>
            I'm a very ambitious front-end developer looking for a role in an
            established IT company with the opportunity to work with the latest
            technologies on challenging and diverse projects.
          </p>
          <p>
            I'm quite confident, naturally curious, and perpetually working on
            improving my chops one design problem at a time.
          </p>
          <p>
            If I need to define myself in one sentence that would be a family
            person, sports fanatic and tech obsessed.
          </p>
        </div>

        <div className="stage-cube-cont">
          <div className="cubespinner">
            <div className="face1">
              <FontAwesomeIcon icon={faReact} color="#5ed4f4"></FontAwesomeIcon>
            </div>
            <div className="face2">
              <FontAwesomeIcon icon={faHtml5} color="#f06529"></FontAwesomeIcon>
            </div>
            <div className="face3">
              <FontAwesomeIcon icon={faCss3} color="#28a4d9"></FontAwesomeIcon>
            </div>
            <div className="face4">
              <FontAwesomeIcon icon={faNode} color="#dd0031"></FontAwesomeIcon>
            </div>
            <div className="face5">
              <FontAwesomeIcon
                icon={faJsSquare}
                color="#efd81d"
              ></FontAwesomeIcon>
            </div>
            <div className="face6">
              <FontAwesomeIcon
                icon={faGitAlt}
                color="#ec4d28"
              ></FontAwesomeIcon>
            </div>
          </div>
        </div>
      </div>
      <Loader type="pacman" />
    </>
  )
}

export default About
