import Link from 'next/link'
import { useContext } from 'react'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'

import UserContext from './UserContext'

export default ({ user: serverUser }) => {
  const { user, getLineProfile } = useContext(UserContext)

  const profile = getLineProfile(serverUser || user) || {
    displayName: '訪客',
    pictureUrl: 'https://www.gravatar.com/avatar/'
  }

  return (
    <Navbar bg='light' expand='sm' fixed='top'>
      <Navbar.Brand>
        <Link href='/'>
          <a>
            <span className='logo-default'>
              百漢中醫
            </span>
          </a>
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='basic-navbar-nav' />
      <Navbar.Collapse id='basic-navbar-nav'>
        <Nav className='ml-auto align-items-center-sm align-items-start-xs'>
          <Nav.Item className='mr-3'>
            <Link href='/orders'>
              <a>我的訂單</a>
            </Link>
          </Nav.Item>

          <div className='profile'>
            <span>{profile.displayName}</span>
            <img src={profile.pictureUrl} className='avatar ml-2' style={{ width: 23, height: 23 }} />
          </div>
        </Nav>
      </Navbar.Collapse>
    </Navbar>

  )
}
