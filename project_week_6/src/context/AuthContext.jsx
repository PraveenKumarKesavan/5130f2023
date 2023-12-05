/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { useNavigate } from "react-router";
import { collection, getDocs } from "firebase/firestore";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  // const location = useLocation();
  const provider = new GoogleAuthProvider();

  const timeout = useRef();
  console.log("AuthProvider", { user });

  async function login({ email, password }) {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) {
        navigate("/");
      }
      return true;
    } catch (error) {
      const errorMessage = error.message;
      console.log(errorMessage);
      setErrorMessage("Invalid Email/Password");
      return false;
    }
  }

  function register({ email, password, name }) {
    setIsLoading(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        updateProfile(auth.currentUser, {
          displayName: name,
        })
          .then(() => {
            setIsLoading(false);

            // Profile updated!
            // ...
          })
          .catch((error) => {
            // An error occurred
            // ...
            console.log(error);
          });
      })
      .catch((error) => {
        setIsLoading(false);
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        if (errorCode === "auth/weak-password") {
          setErrorMessage("Password is Weak");
        } else {
          setErrorMessage(errorMessage);
        }
      });
  }
  async function resetPassword(email) {
    try {
      const data = await sendPasswordResetEmail(auth, email);

      return data;
    } catch (error) {
      const errorMessage = error.message;
      setErrorMessage(errorMessage);
      return false;
    }
  }
  function signOutUser() {
    signOut(auth)
      .then(() => {
        console.log("Sign Out Sucessfull");
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function googleSignIn() {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        // // The signed-in user info.
        const user = result.user;
        console.log(user);
        setIsAuthenticated(true);
        setUser(user);
        // // IdP data available using getAdditionalUserInfo(result)
        // // ...
      })
      .catch((error) => {
        // Handle Errors here.
        // const errorCode = error.code;
        console.log(error);
        const errorMessage = error.message;
        // // The email of the user's account used.
        // const email = error.customData.email;
        setError(errorMessage);
        // // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        // // ...
      });
  }

  useEffect(() => {
    const subscription = onAuthStateChanged(auth, async (user) => {
      if (user != null) {
        setIsAuthenticated(true);
        setUser(user);
      } else {
        setIsAuthenticated(false);
        console.log("😢 We are not authenticated!");
      }
      setIsLoading(false);
    });
    return () => {
      subscription();
      clearTimeout(timeout.current);
    };
  }, []);

  const setErrorMessage = (err) => {
    setError(err);
    if (timeout.current) {
      console.log(timeout.current);
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(() => {
      setError(null);
    }, 3000);
  };

  useEffect(() => {
    const fetchedEvents = [];
    console.log("We are fetching events...");

    async function fetchData() {
      const querySnapshot = await getDocs(collection(db, "events"));
      querySnapshot.forEach((doc) => {
        fetchedEvents.push(doc.data());
      });
      setEvents(fetchedEvents);
      setAllEvents(fetchedEvents);
    }
    fetchData();
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        signOutUser,
        login,
        error,
        events,
        setEvents,
        register,
        allEvents,
        setUser,
        resetPassword,
        googleSignIn,
      }}
    >
      {!isLoading ? (
        children
      ) : (
        <>
          <div className="flex items-center justify-center w-56 h-56 mx-auto">
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </>
      )}
    </AuthContext.Provider>
  );
};
