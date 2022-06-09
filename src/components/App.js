import {authService} from "fbase";
import AppRouter from "components/Router";
import { useState, useEffect } from "react";
import Footer from "components/Footer";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged(user => {
      if(user) {
        setUserObj(user);
      }
      setInit(true);
    });
  }, []);
  return (
    <>
      {init ?  <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} /> : "Initializing..."}
      <Footer />
    </>
  )
}

export default App;
