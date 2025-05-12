import React, { useEffect, useState } from "react";
import "../Styles/NavBar.css";
import { Link } from "react-router-dom";
import User from "../assets/User.png";
import Search from "../assets/Search.png";
import { auth } from "../Config/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function NavBar() {
  const [user, setUser] = useState(undefined);
  const [isBurger, setIsBurger] = useState(false);

  const navigate = useNavigate("/");

  const handleSearch = (e) => {
    if (typeof e === "string" && e.trim() === "") {
      navigate("/");
      return;
    }
    if (typeof e === "string") {
      navigate("/search", { state: { value: e } });
    }
  };


  const toHome = () =>{
    navigate('/')
  }

  const navMountedStyle = {
    transition: "1s",
  };
  const navUnMountedStyle = {
    transition: "1s",
  };

  const mountedStyle = {
    animation: "inAnimation 250ms ease-in",
    overflow: "hidden",
  };
  const unmountedStyle = {
    animation: "outAnimation 270ms ease-out",
    animationFillMode: "forwards",
  };

  const handleBurger = () => {
    if (isBurger == true) {
      setIsBurger(false);
    } else if (isBurger == false) {
      setIsBurger(true);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    toast.success("Logged Out");
    // navigate(0)
    // navigate("/")
  };
  useEffect(() => {
    const authChanged = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => authChanged();
  }, []);

  return (
    <nav>
      {user === null && (
        <div className="NavBarcontent">
          {isBurger && (
            <div
              style={isBurger ? mountedStyle : unmountedStyle}
              className="testbch"
            >
              <div className="btnContainer">
                <button onClick={handleBurger}>X</button>
              </div>

              <ul className="nav-linkss">
                <li className="nav-linkk">
                  <Link className="nav-link-linkk" onClick={() => setIsBurger(false)} to="/">
                    Home
                  </Link>
                </li>

                <li className="nav-linkk" onClick={() => setIsBurger(false)}>
                  <Link className="nav-link-linkk" to="/auth">
                    Admin LogIn
                  </Link>
                </li>
              </ul>
            </div>
          )}
          <h1 className="nav-title" onClick={toHome}>
            <span className="nav-title-span">Note</span>Full
          </h1>
          <ul className="nav-links">
            <li className="nav-link">
              <Link className="nav-link-link" to="/">
                Home
              </Link>
            </li>

            <li className="nav-link">
              <Link className="nav-link-link" to="/auth">
                Admin LogIn
              </Link>
            </li>
          </ul>
          <div className="last-wrapper">
            <div className="search">
              <input
                type="search"
                placeholder="search topics..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(e.target.value);
                  }
                }}
              />
              <img src={Search} alt="search icon" />
            </div>
          </div>
          <div className="burger" onClick={handleBurger}>
            <div className="BurgerLine"></div>
            <div className="BurgerLine"></div>
            <div className="BurgerLine"></div>
          </div>
        </div>
      )}
      {user && (
        <div className="NavBarcontent">
          {isBurger && (
            <div
              style={isBurger ? mountedStyle : unmountedStyle}
              className="testbch"
            >
              <div className="btnContainer">
                <button onClick={handleBurger}>X</button>
              </div>
              <ul className="nav-linkss">
                <li className="nav-linkk" onClick={() => setIsBurger(false)}>
                  <Link className="nav-link-linkk" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-linkk" onClick={() => setIsBurger(false)}>
                  <Link className="nav-link-linkk" to="/post">
                    Post
                  </Link>
                </li>
                <li className="nav-linkk" onClick={() => setIsBurger(false)}>
                  <Link className="nav-link-linkk" to="/editprofile">
                    Edit Profile
                  </Link>
                </li>
                <li className="nav-linkk" onClick={() => setIsBurger(false)}>
                  <p className="nav-link-linkk" onClick={() => handleSignOut()}>
                    Logout
                  </p>
                </li>
              </ul>
            </div>
          )}
          <h1 className="nav-title" onClick={toHome}>
            <span className="nav-title-span">Note</span>Full{" "}
            <span className="nav-title-admin">| admin</span>
          </h1>
          <ul className="nav-links">
            <li className="nav-link">
              <Link className="nav-link-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-link">
              <Link className="nav-link-link" to="/post">
                Post
              </Link>
            </li>
            <li className="nav-link">
              <Link className="nav-link-link" to="/editprofile">
                Edit Profile
              </Link>
            </li>
            <li className="nav-link">
              <p className="nav-link-link" onClick={() => handleSignOut()}>
                Logout
              </p>
            </li>
          </ul>
          <div className="last-wrapper">
            <div className="search">
              <input
                type="search"
                placeholder="search topics..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(e.target.value);
                  }
                }}
              />
              <img src={Search} alt="search icon" />
            </div>
          </div>
          <div className="burger" onClick={handleBurger}>
            <div className="BurgerLine"></div>
            <div className="BurgerLine"></div>
            <div className="BurgerLine"></div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
