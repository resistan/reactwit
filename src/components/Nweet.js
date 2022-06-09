import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { dbService, storageService } from "fbase";
import { doc, deleteDoc, updateDoc } from"firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { useState } from "react";
import "scss/nweet.scss";

const Nweet = ({nweetObj, isOwner}) => {
	// console.log(nweetObj)
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
			if(nweetObj.attachmentUrl) await deleteObject(ref(storageService, nweetObj.attachmentUrl));
		}
	}

	return (
		<div className="nweet">
			{
				editing ?
				<>
				{isOwner && (
					<>
						<form onSubmit={onSubmit} className="container nweetEdit">
							<input type="text" placeholder="Edit your mind" value={newNweet} onChange={onChange} required className="formInput"/>
							<input type="submit" value="Updatweet" className="formBtn" />
						</form>
						<button onClick={onEditClick} className="formBtn cancelBtn">Cancel</button>
					</>
					)
				}
				</>
				:
				<div>
					<h4>{nweetObj.text}</h4>
					{nweetObj.attachmentUrl && <p><img src={nweetObj.attachmentUrl} alt="attachment" /></p> }
					{isOwner &&
						<div className="nweet__actions">
							<button onClick={onEditClick}>
								<FontAwesomeIcon icon={faPencilAlt} />
								<span className="a11yHidden">Edit</span>
							</button>
							<button onClick={onDeleteClick}>
								<FontAwesomeIcon icon={faTrash} />
								<span className="a11yHidden">Delete</span>
							</button>
						</div>
					}
				</div>
			}
		</div>
	)
}
export default Nweet;