import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { authService, fbase } from "fbase";
import { async } from "@firebase/util";

const Auth = () => {
	authService.languageCode = "ko";
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [newAccount, setNewAccount] = useState(true);
	const [error,setError] = useState(null);
	const onChange = (event) => {
		const {target: {name, value}} = event;
		if(name==="email"){
			setEmail(value);
		}
		if(name==="password"){
			setPassword(value);
		}
	}
	const onSumbit = async (event) => {
		event.preventDefault();
		let data;
		try {
			if(newAccount){
				// create account
				data = await createUserWithEmailAndPassword(authService,email,password)
			} else {
				// log in
				data = await signInWithEmailAndPassword(authService,email,password)
			}
			// console.log(data)
		} catch (error) {
			setError(error.message)
		}
	}
	const toggleAccount = () => setNewAccount(!newAccount);
	const onSocialClick = async (event) => {
		const {target: {name}} = event;
		let provider;
		if(name==="google"){
			provider = new GoogleAuthProvider();
		}
		if(name==="github"){
			provider = new GithubAuthProvider();
		}
		const data = await signInWithPopup(authService, provider);
		console.log(data)
	}
	return (<div>
		<h1>{newAccount ? "Create Account" : "Log In"} <button onClick={toggleAccount}>{newAccount ? "Log In" : "Create account"}</button></h1>
		<form onSubmit={onSumbit}>
			<p>{error ? error : ""}</p>
			<input type="email" name="email" placeholder="Email" required value={email} onChange={onChange} />
			<input type="password" name="password" placeholder="Password" required value={password} onChange={onChange} />
			<input type="submit" value={newAccount ? "Create Account" : "Log in"} />
		</form>
		<div>
			<button onClick={onSocialClick} name="google">Continue with Google</button>
			<button onClick={onSocialClick} name="github">Continue with Github</button>
		</div>
	</div>)
}
export default Auth;