import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import './Login.css'

export const Login = (props) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (props.login) {
      props.login(username, password);
    }
  };
  useEffect(() => {
    if (props.user) {
      navigate("/");
    }
  }, [props.user, navigate]);

  return (
    <>
      <div className="login">
        <h1 className="text-center font-weight-bold">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="d-flex justify-content-center">
            <label htmlFor="username">Username</label>
          </div>
          <div className="d-flex justify-content-center">
            <input
              type="text"
              id="username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="d-flex justify-content-center">
            <label htmlFor="password">Password</label>
          </div>
          <div className="d-flex justify-content-center">
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="text-danger d-flex justify-content-center">
            {props.errorMessage}
          </div>
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary mt-2 ">
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
Login.propTypes = {
  login: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  user: PropTypes.object,
};
