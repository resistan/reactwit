import { async } from "@firebase/util";
import { dbService, storageService } from "fbase";
import { doc, deleteDoc, updateDoc } from"firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { useState } from "react";

const Nweet = ({nweetObj, isOwner}) => {
	const nweetRef = doc(dbService, "reactwit",`${nweetObj.id}`);
	const [editing, setEditing] = useState(false);
	const [newNweet, setnewNweet] = useState(nweetObj.text);

	const onEditClick = () => setEditing( prev => !prev);
	const onChange = (event) => {
		const {target:{value}} = event;
		setnewNweet(value);
	}
	const onSubmit = async (event) => {
		event.preventDefault();
		await updateDoc(nweetRef, {
			text: newNweet
		});
		onEditClick();
	}

	const onDeleteClick = async() => {
		const ok = window.confirm("Are you sure you want to edit this nweet?");
		if(ok) {
			await deleteDoc(nweetRef);
			await deleteObject(ref(storageService, nweetObj.attachmentUrl));
		}
	}

	return (
		<>
		<div>
		{
			editing ?
			<>
			{isOwner && (
				<>
				<form onSubmit={onSubmit}>
				<input type="text" placeholder="Edit your mind" value={newNweet} onChange={onChange} required/>
				<input type="submit" value="Updatweet" />
				</form>
				<button onClick={onEditClick}>Cancel</button>
				</>
				)
			}
			</>
			:
			<div>
				<p>{nweetObj.text}
					{isOwner &&
						<>
						<button onClick={onEditClick}>Edit</button>
						<button onClick={onDeleteClick}>Delete</button>
						</>
					}
				</p>
				{nweetObj.attachmentUrl && <p><img src={nweetObj.attachmentUrl} alt="attachment" /></p> }
			</div>
		}
		</div>
		</>
	)
}
export default Nweet;