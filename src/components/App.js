import {authService, fbase} from "fbase";
import AppRouter from "components/Router";
import { useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  return (
    <>
      <AppRouter isLoggedIn={isLoggedIn} />
      <footer>&copy; {new Date().getFullYear()} Reactwit</footer>
    </>
  )
}

export default App;
