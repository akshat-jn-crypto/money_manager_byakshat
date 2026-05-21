import React, {useEffect,useState} from "react";
import { Link,useNavigate } from "react-router-dom";
import { message } from "antd";
import "../../styles/HeaderStyles.css";
const Header = () => {
  const [loginUser, setLoginUser] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setLoginUser(user);
    }
  }, []);
  const logoutHandler = () => {
    localStorage.removeItem("user");
    message.success("Logout Successfully");
    navigate("/login");
  };
  return (
    <>
      <nav className="navbar bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            💰 Expense Manager
          </Link>
          <ul className="navbar-nav ms-auto flex-row align-items-center">
            <li className="nav-item">
              <p className="nav-link user-name">
                {loginUser && loginUser.name}
              </p>
            </li>
            <li className="nav-item">
              <button className="btn btn-primary" onClick={logoutHandler}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header;