import React, { useEffect, useState } from "react";
import "../Styles/Auth.css";
import { auth } from "../Config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../Components/Loader";
import validator from "email-validator";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(undefined);


  // console.log(validator.validate(email))

  const handleLogin = async () => {
    if (validator.validate(email)) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Logged In!");
        navigate("/");
      } catch (err) {
        toast.error("Incorrect Password Or Email");
      }
    }else{
      toast.error("Invalid Email!")
    }
  };

  useEffect(() => {
    const authChanged = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => authChanged();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    if (user != null) {
      // alert('you are already logged in')
      // toast.error("You Are Already Logged In")
      navigate("/");
    }
  }, [user]);

  console.log(user);

  return (
    <div className="auth">
      {user === undefined && <Loader />}
      {user === null && (
        <div className="auth-content">
          <h1 className="auth-title">Login</h1>
          <form
            className="auth-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div className="input-box">
              <label htmlFor="email">Email</label>
              <input
                className="input"
                type="email"
                id="email"
                placeholder="youremail@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-box">
              <label htmlFor="password">Password</label>
              <input
                className="input"
                type="password"
                placeholder="mustbe atleast 8 characters long"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <input
              className="submit"
              type="submit"
              value="Login"
              disabled={password.length <= 7}
            />
          </form>
        </div>
      )}
    </div>
  );
}

export default Auth;
