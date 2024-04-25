import {
  User,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { auth } from "@/firebase";

export default function Login({
  onLoginSuccess,
}: {
  onLoginSuccess: (user: User) => void;
}) {
  const handleLogin = async (
    provider:
      | GoogleAuthProvider
      | FacebookAuthProvider
      | TwitterAuthProvider
      | GithubAuthProvider
  ) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      onLoginSuccess(user);
    } catch (error) {
      console.error(error);
    }
  };
  const handleGoogleLogin = () => {
    handleLogin(new GoogleAuthProvider());
  };

  const handleFacebookLogin = () => {
    handleLogin(new FacebookAuthProvider());
  };

  const handleTwitterLogin = async () => {
    handleLogin(new TwitterAuthProvider());
  };

  const handleGithubLogin = async () => {
    handleLogin(new GithubAuthProvider());
  };

  return (
    <div className="login-box">
      <button id="google-btn" className="button" onClick={handleGoogleLogin}>
        Login With Google
      </button>
      <button
        id="facebook-btn"
        className="button"
        onClick={handleFacebookLogin}
      >
        Login With Facebook
      </button>
      <button id="twitter-btn" className="button" onClick={handleTwitterLogin}>
        Login With Twitter
      </button>
      <button id="github-btn" className="button" onClick={handleGithubLogin}>
        Login With Github
      </button>
    </div>
  );
}
