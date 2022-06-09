import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { authService } from "fbase";
import "scss/authForm.scss"

const AuthForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [newAccount, setNewAccount] = useState(true);
	const [error,setError] = useState(null);
	const toggleAccount = () => setNewAccount(!newAccount);
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
	return (
		<>
			<h1>{newAccount ? "Create Account" : "Log In"} <button onClick={toggleAccount} className="authSwitch">{newAccount ? "Log In" : "Create account"}</button></h1>
			<form onSubmit={onSumbit} className="container">
				{error && <p className="error">{error}</p>}
				<input type="email" name="email" placeholder="Email" required value={email} onChange={onChange} className="authInput" />
				<input type="password" name="password" placeholder="Password" required value={password} onChange={onChange}  className="authInput" />
				<input type="submit" value={newAccount ? "Create Account" : "Log in"} className="authInput authSubmit"/>
			</form>
		</>
	)
}

export default AuthForm;