import PropTypes from "prop-types";
import { useEffect } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import './Header.css';
export const Header = (props) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    props.onLogout();
  };
  const handleLogin = () => {
    navigate("/login");
  };
  useEffect(() => {
    if (!props.user) {
      props.getUser();
    }
  });
  return (
    <header
      className="header"
    >
      <h1>Welcome {props.user?.username || "Guest"}</h1>
      <div className="button-container">
        {props.user ? (
          <Button className="btn btn-logout" variant="primary" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Button className="btn btn-login" variant="primary" onClick={handleLogin}>
            Login
          </Button>
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
};
