import { authService } from "fbase";
import { updateProfile } from "firebase/auth";
import AppRouter from "components/Router";
import { useState, useEffect } from "react";
import Footer from "components/Footer";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged(user => {
      if(user) {
        if(user.displayName === null) updateProfile(userObj, {displayName: user.email.split("@")[0]});
        setUserObj({
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
          updateProfile: (args) => updateProfile(user, args)
        });
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      photoURL: user.photoURL,
      uid: user.uid,
      updateProfile: (args) => updateProfile(user, args)
    });
  }
  return (
    <>
      {init ?  <AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj={userObj} /> : "Initializing..."}
      <Footer />
    </>
  )
}

export default App;
