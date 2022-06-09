import { dbService } from "fbase";
import { addDoc, getDocs, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";
import Nweet from "components/Nweet";

const Home = ( {userObj} ) => {
	const [nweet, setNweet] = useState('');
	const [nweets, setNweets] = useState([]);

	// old method
	// const getNweets = async() => {
	// 	const dbNweets = await getDocs(collection(dbService, "reactwit"));
	// 	dbNweets.forEach( (doc) => {
	// 		const nweetObj = {
	// 			...doc.data(),
	// 			id: doc.id
	// 		}
	// 		setNweets((prev) => [nweetObj, ...prev]);
	// 	});
	// }

	useEffect( () => {
		const q = query(collection(dbService, "reactwit"), orderBy("createdAt", "desc"));
		onSnapshot(q, (snapshot) => {
			const nweetArr = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setNweets(nweetArr);
		});
	}, []);
	const onSubmit = async (event) => {
		event.preventDefault();
		await addDoc(collection(dbService, "reactwit"), {
			text: nweet,
			createdAt: Date.now(),
			authorId: userObj.uid
		});
		setNweet('');
	}
	const onChange = (event) => {
		const { target: { value } } = event;
		setNweet(value);
	}
	// console.log(nweets)
	return (
		<>
		<form onSubmit={onSubmit}>
		<input type="text" placeholder="What's your mind?" maxLength="120" value={nweet} onChange={onChange} />
		<input type="submit" value="Reactweet" />
		</form>
		{nweets.map( (nweet) => <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.authorId === userObj.uid} /> )}
		</>
		)
	}
	export default Home;