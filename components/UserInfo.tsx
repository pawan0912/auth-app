import { auth } from "@/firebase";
import { signOut } from "firebase/auth";

function maskEmail(email: string) {
  // Regular expression to match everything before the "@" symbol
  const regex = /^(.*)@/;

  // Extract the username part of the email
  const username = email.match(regex)[1];

  // Replace all characters except the first and last with asterisks (*)
  const maskedUsername = username.replace(/./g, function (char, index) {
    return index === 0 || index === username.length - 1 ? char : "*";
  });

  // Combine masked username with "@" symbol and remaining email
  return maskedUsername + email.slice(username.length);
}

export default function UserInfo() {
  const user = auth.currentUser;
  const name = user?.displayName ?? "";
  const email = user?.email ?? "";
  const maskedEmail = maskEmail(email);
  const handleLogout = () => {
    signOut(auth);
  };
  return (
    <div className="user-info">
      <p>name: {name} </p>
      <p>email: {maskedEmail} </p>
      <button id="logout-btn" className="button" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
}
