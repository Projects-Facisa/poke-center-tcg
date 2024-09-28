import React, { createContext, useState } from "react";

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [imageProfile, setImageProfile] = useState(
    localStorage.getItem("profileImage") || ""
  );

  const updateProfileImage = (newImage) => {
    setImageProfile(newImage);
    localStorage.setItem("profileImage", newImage);
  };

  return (
    <ProfileContext.Provider value={{ imageProfile, updateProfileImage }}>
      {children}
    </ProfileContext.Provider>
  );
};
