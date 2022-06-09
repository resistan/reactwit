import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import "scss/nav.scss";

const Navigation = ({userObj}) => {
	return (
		<nav>
			<div className="home">
				<Link to="/">
					<FontAwesomeIcon icon={faTwitter} color={"#FFFFFF"} size="2x" />
					<span className="a11yHidden">Home</span>
				</Link>
			</div>
			<ul>
				<li><Link to="/profile">
					{userObj.photoURL ? <img src={userObj.photoURL} alt="profile image" /> : <FontAwesomeIcon icon={faUser} />}
					{userObj.displayName ? userObj.displayName : "Profile"}
				</Link></li>
			</ul>
		</nav>
	)
}

export default Navigation;