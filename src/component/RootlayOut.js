import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import NavMenu from './NavMenu'

const RootlayOut = () => {
  return (
    <>
      <NavMenu></NavMenu>
      <Outlet></Outlet>
      <Footer></Footer>
    </>
  )
}

export default RootlayOut