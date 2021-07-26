import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center px-2 sm:px-0">
      <div className="text-2xl font-semibold">Sorry, this page isn't available.</div>
      <div className="mx-2 sm:mx-0">The link you followed may be broken, or the page may have been removed. </div>
      <Link to="/"><div className="mt-1 font-medium">Go back to Home.</div></Link>
      
    </div>
  )
}

export default NotFound
