import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center ">
      <div className="text-2xl font-semibold">Sorry, this page isn't available.</div>
      <div>The link you followed may be broken, or the page may have been removed. Go back to <Link to="/">Home</Link>.</div>
      
    </div>
  )
}

export default NotFound
