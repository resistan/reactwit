import Nweet from "components/Nweet";
import { authService, dbService } from "fbase";
import { updateProfile } from "firebase/auth";
import { query, collection, onSnapshot, where, orderBy } from "firebase/firestore";
import { useState,useEffect } from "react";

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
			await updateProfile(authService.currentUser, { displayName: newDisplayName });
			refreshUser();
		}
	}


	return(
		<>
			<h1>
				<img src={userObj.photoURL} alt="profile image" />
				{userObj.displayName}
				<button onClick={onLogOutClick}>Log out</button>
			</h1>
			<form onSubmit={onSubmit}>
				<input type="text" placeholder="Display name" value={newDisplayName} onChange={onChange} />
				<input type="submit" value="Update profile" />
			</form>
			<h2>My nweets</h2>
			{nweets.map( (nweet) => <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.authorId === userObj.uid} /> )}
		</>
	)
};
export default Profile;