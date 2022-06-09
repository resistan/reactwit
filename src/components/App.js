import { authService } from "fbase";
import { updateProfile } from "firebase/auth";
import AppRouter from "components/Router";
import { useState, useEffect } from "react";

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
      } else {
        setUserObj(null);
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
    <div className="wrap">
      {init ?  <AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj={userObj} /> : "Initializing..."}
    </div>
  )
}

export default App;
