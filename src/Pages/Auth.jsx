import React, { useEffect, useState } from 'react'
import '../Styles/Auth.css'
import { auth } from '../Config/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loader from '../Components/Loader'

function Auth() {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [user, setUser] = useState(undefined)

  const handleLogin = async () => {
    try{
      navigate('/')
      await signInWithEmailAndPassword(auth, email, password)
      toast.success('Logged in!')
    } catch (err){
      toast.error("Password Incorrect or Cant find Admin.")
    }
  }

  useEffect(() => {
   const authChanged = auth.onAuthStateChanged((user) => {
    setUser(user)
   })
   return () => authChanged()
  }, [])

  const navigate = useNavigate()


  useEffect(() => {
    if (user != null){
      // alert('you are already logged in')
      toast.error("you are already Logged in")
      navigate('/')
    }
  }, [user])

  console.log(user)


  return (
    <div className='auth'>
      {user === undefined && <Loader/>}
      {user === null &&
        <div className="auth-content">
            <h1 className='auth-title'>Login</h1>
            <form 
            className='auth-form'
            onSubmit={(e) =>{
              e.preventDefault()
              handleLogin()
            }}
            >
                <div className="input-box">
                <label htmlFor="email">Email</label>
                <input className='input' type="email" id="email" placeholder='youremail@gmail.com' onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="input-box">
                <label htmlFor="password">Password</label>
                <input className='input' type="password" placeholder='mustbe atleast 8 characters long' onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <input className='submit' type="submit" value="Login" />
            </form>
        </div>
      }
    </div>
  )
}

export default Auth