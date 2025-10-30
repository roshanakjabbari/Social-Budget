import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Header } from "./components/Header";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import API from "./API/API.mjs";
import { GuestsHome } from "./components/GuestsHome";
function App() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const login = (username, password) => {
    API.login(username, password)
      .then((res) => setUser(res))
      .catch((err) => setErrorMessage(err.message));
  };
  const onLogout = () => {
    API.logOut().then(() => setUser(null));
  };

  const getUser = () => {
    API.getUserInfo().then((res) => setUser(res));
  };
  return (
    <>
      {location.pathname !== "/login" && (
        <Header user={user} onLogout={onLogout} getUser={getUser} />
      )}
      <Routes>
        <Route
          path="/"
          element={user ? <Home user={user} /> : <GuestsHome user={user} />}
        />
        <Route
          path="/login"
          element={
            <Login login={login} errorMessage={errorMessage} user={user} />
          }
        />
      </Routes>
    </>
  );
}

export default App;
