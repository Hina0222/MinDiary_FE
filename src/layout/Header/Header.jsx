import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import "./header.css";
import logoImage from "./logo.png";
import GoogleLoginButton from "../../pages/GoogleLoginButton";
import useTokenHandler from "./useTokenHandler";
import API from "../../BaseUrl";
import axios from "axios";

Modal.setAppElement("#root");

const Header = () => {
  const navigate = useNavigate();
  const { checkToken } = useTokenHandler();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken")
  );

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setIsLoggedIn(true);
    }
  }, []);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", true);
    closeModal();
  };

  const handleLogout = async () => {
    try {
      const res = await axios.get("/api/v1/account/logout", {
        headers: {
          Authorization: `${localStorage.getItem("accessToken")}`,
        },
      }
    );
    navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const logout = () => {
    handleLogout();
    setIsLoggedIn(false);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.setItem("isLoggedIn", false);
  };

  return (
    <header className="header-1">
      <nav className="navigation">
        <ul>
          <li className="nav-item">
            <NavLink to="/" className="nav-link" activeClassName="active">
              HOME
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/diary"
              className="nav-link"
              activeClassName="active"
              onClick={checkToken}
            >
              DIARY
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="logo">
        <img src={logoImage} alt="logo" />
      </div>
      <div className="auth-buttons">
        {isLoggedIn ? (
          <button className="logout-btn" onClick={logout}>
            Log out
          </button>
        ) : (
          <button className="login-btn" onClick={openModal}>
            Log in
          </button>
        )}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Login Modal"
        className="modal full-screen-modal"
        overlayClassName="overlay full-screen-overlay"
      >
        <button onClick={closeModal} className="close-modal-btn">
          Close
        </button>
        <GoogleLoginButton onLoginSuccess={handleLogin} />
      </Modal>
    </header>
  );
};

export default Header;
