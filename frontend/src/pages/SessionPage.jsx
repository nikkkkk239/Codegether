import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {useAuthStore} from "../store/useAuthStore"
import {useSessionStore} from "../store/useSessionStore"

const ProtectedPage = () => {
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {selectedSession} = useSessionStore()
  const {authUser} = useAuthStore()


  useEffect(() => {
    const handleNavigation = (event) => {
      if (!isNavigating) {
        const shouldNavigate = window.confirm(
          "Are you sure you want to leave this page? Unsaved changes might be lost."
        );
        if (!shouldNavigate) {
          event.preventDefault();
        } else {
          setIsNavigating(true); 
        }
      }
    };

    const unlisten = navigate.listen(({ location }) => {
      selectedSession.creatorId === authUser._id && handleNavigation(location);
    });

    return () => {
      unlisten(); 
    };
  }, [isNavigating, navigate]);

  return (
    <div>
      <h1>Protected Page</h1>
      <p>Try navigating to another route to see the confirmation popup.</p>
    </div>
  );
};

export default ProtectedPage;