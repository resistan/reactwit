import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "components/Nav";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";

const AppRouter = ({refreshUser, isLoggedIn, userObj}) => {
	return (
		<Router>
			{isLoggedIn && <Navigation userObj={userObj} />}
			<Routes>
				{isLoggedIn ?
					<>
						<Route exact path="/" element={<Home userObj={userObj}/>} />
						<Route exact path="/profile" element={<Profile userObj={userObj} refreshUser={refreshUser} />} />
					</>
					:
					<>
						<Route exact path="/profile" element={<Auth />} />
						<Route exact path="/" element={<Auth />} />
					</>
				}
			</Routes>
		</Router>
	)
}

export default AppRouter;