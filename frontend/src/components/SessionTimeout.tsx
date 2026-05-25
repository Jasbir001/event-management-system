import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SessionTimeout: React.FC = () => {
  const navigate = useNavigate();
  const timeoutId = useRef<number | null>(null);

  const resetTimeout = () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    
    // Only set timeout if user is logged in
    if (sessionStorage.getItem("userLoggedIn") === "true") {
      timeoutId.current = window.setTimeout(() => {
        // 5 minutes of inactivity reached
        sessionStorage.removeItem("userLoggedIn");
        sessionStorage.removeItem("userRole");
        sessionStorage.removeItem("userEmail");
        alert("You have been automatically logged out due to 5 minutes of inactivity.");
        navigate("/login");
        window.location.reload(); // Reload to clear all context/states
      }, 5 * 60 * 1000); // 5 minutes
    }
  };

  useEffect(() => {
    // Initial setup
    resetTimeout();

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      resetTimeout();
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [navigate]);

  return null;
};

export default SessionTimeout;
