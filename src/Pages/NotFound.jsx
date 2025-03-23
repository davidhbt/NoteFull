import React from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
function NotFound() {
    const navigate = useNavigate()

    useEffect(() => {
        navigate("/")
        toast.error('page not Found')
    },[])
  return (
    <div className="NotFoundPage" style={{minWidth: '100vh'}}>
        <div className="NotFoundContainer">
            <h1>Page Not Found</h1>
        </div>
    </div>
  )
}

export default NotFound