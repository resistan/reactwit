import Nweet from "components/Nweet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { authService, dbService } from "fbase";
import { updateProfile } from "firebase/auth";
import { query, collection, onSnapshot, where, orderBy } from "firebase/firestore";
import { useState,useEffect } from "react";
import "scss/profile.scss"

const Profile = ({userObj, refreshUser}) => {
	// const history = useHistory();
	const [nweets, setNweets] = useState([]);
	const onLogOutClick = () => {
		authService.signOut();
		window.location.href="/";
	}
	const dbRef = collection(dbService, "reactwit");

	const getMyNweets = async() => {
		const q = query(dbRef, where("authorId", "==", userObj.uid), orderBy("createdAt", "desc"));
		onSnapshot(q, (snapshot) => {
			const nweetArr = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setNweets(nweetArr);
		});
	}

	useEffect(() => {
		getMyNweets();
	}, []);

	const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
	const onChange = (event) => {
		const { target: { value } } = event;
		setNewDisplayName(value);
	}
	const onSubmit = async (event) => {
		event.preventDefault();
		if(newDisplayName !== userObj.displayName) {
			await updateProfile(authService.currentUser, { displayName: newDisplayName, photoURL: userObj.photoURL });
			refreshUser();
		}
		onToggleEdit();
	}

	const [profileToggle, setProfileToggle] = useState(false);
	const onToggleEdit = () => setProfileToggle( prev => !prev);

	return(
		<div className="container">
			<div className="userInfo">
					<img src={userObj.photoURL} alt="profile image" />
					{profileToggle ?
					<form onSubmit={onSubmit} className="profileForm">
						<input type="text" placeholder="Display name" value={newDisplayName} onChange={onChange} className="formInput" />
						<input type="submit" value="Change name" className="formBtn" />
					</form>
					:
					<>
						<h1>{userObj.displayName}
							<button onClick={onToggleEdit}>
								<FontAwesomeIcon icon={faPencilAlt} />
								<span className="a11yHidden">Edit</span>
							</button>
						</h1>
					</>
					}
			</div>
			<h2>My nweets</h2>
			{nweets.map( (nweet) => <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.authorId === userObj.uid} /> )}
			<button onClick={onLogOutClick} className="formBtn cancelBtn logOut">Log out</button>
		</div>
	)
};
export default Profile;