import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { authService } from "fbase";
import AuthForm from "components/AuthForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import "scss/auth.scss"

const Auth = () => {
	authService.languageCode = "ko";
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
	return (
		<div className="authContainer">
			<FontAwesomeIcon icon={faTwitter} color={"#FFFFFF"} size="3x" />
			<AuthForm />
			<div className="authBtns">
				<button onClick={onSocialClick} name="google" className="authBtn">
					Continue with Google
					<FontAwesomeIcon icon={faGoogle} />
				</button>
				<button onClick={onSocialClick} name="github" className="authBtn">
					Continue with Github
					<FontAwesomeIcon icon={faGithub} />
				</button>
			</div>
		</div>
	)
}
export default Auth;