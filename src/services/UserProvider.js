import React, { createContext, useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!auth) return; // Prevent issues if auth is not initialized

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {

          const userDoc = await getDoc(doc(db, "users", authUser.uid));

          if (userDoc.exists()) {
            setUsername(userDoc.data().username);
          }
          setUser(authUser);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
        setUsername("");
      }
    });

    return unsubscribe ? unsubscribe : () => {}; // Prevent undefined function error
  }, []);

  return (
    <UserContext.Provider value={{ user, username }}>
      {children}
    </UserContext.Provider>
  );
};
