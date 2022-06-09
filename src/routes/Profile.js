import { authService } from "fbase";

const Profile = () => {
	// const history = useHistory();
	const onLogOutClick = () => {
		authService.signOut();
	}
	return(
		<button onClick={onLogOutClick}>Log out</button>
	)
};
export default Profile;