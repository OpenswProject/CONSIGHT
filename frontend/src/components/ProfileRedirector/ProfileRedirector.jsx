import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Userprofile from '../../pages/Userprofile'; // Assuming Userprofile is in ../../pages/Userprofile

const ProfileRedirector = ({ currentUser }) => {
  const { username } = useParams();

  if (currentUser && username === currentUser.username) {
    return <Navigate to="/mypage" replace />;
  }

  return <Userprofile currentUser={currentUser} />;
};

export default ProfileRedirector;
