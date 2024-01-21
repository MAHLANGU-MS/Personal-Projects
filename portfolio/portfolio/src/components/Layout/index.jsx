import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar'
import './index.scss'
import Home from '../Home'
import About from '../About'
import Footer from '../Footer'

const Layout = () => {
  return (
    <>
      <div className="App">
        <Sidebar />
        <div className="page">
          {/* <span className="tags top-tags">&lt;body&gt;</span> */}
          <Outlet />
          {/* <Home /> */}
          {/* <span className="tags bottom-tags"> */}
          {/* &lt;body&gt; */}
          <br />
          {/* <span className="bottom-tag-html">&lt;/html&gt;</span> */}
          {/* </span> */}
        </div>
        <Footer />
      </div>
    </>
  )
}

export default Layout
