// src/components/Chat.tsx
import { useEffect } from 'react';

const Chat: React.FC = () => {
  useEffect(() => {
    // Load Tawk.to script only once
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://embed.tawk.to/693bb3a67e41ef1988ae9145/1jc8jbh5s';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    }
    return () => {
      // Clean up script when component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null; // Tawk.to injects its own UI
};

export default Chat;
