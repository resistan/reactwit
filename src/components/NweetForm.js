import { dbService, storageService } from "fbase";
import { v4 as uuidv4 } from 'uuid';
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import "scss/nweetForm.scss";

const NweetForm = ({userObj}) => {
	const [nweet, setNweet] = useState('');
	const [attachment, setAttachment] = useState("");
	const onSubmit = async (event) => {
		if (nweet === "") return;
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
	return (
		<form onSubmit={onSubmit} className="factoryForm">
			<div className="factoryInput__container">
				<input type="text" placeholder="What's your mind?" maxLength="120" value={nweet} onChange={onChange} required className="factoryInput__input" />
				<input type="submit" value="&rarr;" className="factoryInput__arrow" />
			</div>
			<label htmlFor="attach-file" className="factoryInput__label">
				<span>Add Photo</span>
				<FontAwesomeIcon icon={faPlus} />
			</label>
			<input id="attach-file" ref={fileInput} type="file" accept="image/*" onChange={onFileChange}/>
			{attachment &&
				<div className="factoryForm__attachment">
					<img src={attachment} width="50" height="50" alt="attachment" />
					<button onClick={onClearAttachment} className="factoryForm__clear">
						<span>Remove</span>
						<FontAwesomeIcon icon={faTimes} />
					</button>
				</div>
			}
			</form>
	)
}
export default NweetForm;