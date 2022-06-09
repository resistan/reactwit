import { dbService } from "fbase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { useState, useEffect, useRef } from "react";
import NweetForm from "components/NweetForm";
import Nweet from "components/Nweet";

const Home = ( {userObj} ) => {
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
	// console.log(nweets)
	return (
		<>
			<NweetForm userObj={userObj}/>
			{nweets.map( (nweet) => <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.authorId === userObj.uid} /> )}
		</>
	)
}
export default Home;