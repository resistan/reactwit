import { dbService, storageService } from "fbase";
import { v4 as uuidv4 } from 'uuid';
import { addDoc, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { useState, useEffect, useRef } from "react";
import Nweet from "components/Nweet";

const Home = ( {userObj} ) => {
	const [nweet, setNweet] = useState('');
	const [nweets, setNweets] = useState([]);
	const [attachment, setAttachment] = useState("");

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
		let attachmentUrl = "";
		if(attachment !== "") {
			const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
			const response = await uploadString(attachmentRef, attachment, "data_url");
			attachmentUrl = await getDownloadURL(response.ref);
		}
		const nweetObj = {
			text: nweet.trim(),
			createdAt: Date.now(),
			authorId: userObj.uid,
			attachmentUrl
		}
		await addDoc(collection(dbService, "reactwit"), nweetObj);
		setNweet("");
		setAttachment("");
	}
	const onChange = (event) => {
		const { target: { value } } = event;
		setNweet(value);
	}
	const onFileChange = (event) => {
		const { target: { files } } = event;
		const theFile = files[0];
		const reader = new FileReader();
		reader.onloadend = (finishedEvent) => {
			const { currentTarget: { result } } = finishedEvent;
			setAttachment(result);
		}
		reader.readAsDataURL(theFile);
	}
	const fileInput = useRef('');
	const onClearAttachment = () => {
		fileInput.current.value = '';
		setAttachment('');
	}
	// console.log(nweets)
	return (
		<>
		<form onSubmit={onSubmit}>
			<input type="text" placeholder="What's your mind?" maxLength="120" value={nweet} onChange={onChange} required />
			<input ref={fileInput} type="file" accept="image/*" onChange={onFileChange}/>
			<input type="submit" value="Reactweet" />
			{attachment &&
				<div>
					<img src={attachment} width="50" height="50" alt="attachment" />
					<button onClick={onClearAttachment}>Clear attachment</button>
				</div>
			}
			</form>
			{nweets.map( (nweet) => <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.authorId === userObj.uid} /> )}
		</>
	)
}
export default Home;