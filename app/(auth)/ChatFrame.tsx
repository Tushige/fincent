// app/components/ChatIframe.js
"use client"; // Ensures this runs on the client side

import { useEffect } from 'react';

const ChatIframe = () => {
  useEffect(() => {
    const iframe = document.createElement('iframe');
    const style = document.createElement('style');

    style.textContent = `
      .chat-frame {
        position: fixed;
        bottom: 50px;
        right: 50px;
        border: none;
        width: 400px; /* Set a default width */
        height: 600px; /* Set a default height */
        z-index: 1000; /* Ensure it appears on top */
      }
    `;

    iframe.src = "http://localhost:3000/chatbot/2c0aa5d4-80bc-448c-a056-09717ddb4a5d";
    iframe.className = "chat-frame";

    // Append the style and iframe to the document
    document.head.appendChild(style);
    document.body.appendChild(iframe);

    window.addEventListener("message", (e) => {
      console.log('[event] message')
      if (e.origin !== "http://localhost:3000") return;
      let dimensions = JSON.parse(e.data);
      iframe.width = dimensions.width;
      iframe.height = dimensions.height;
    });
    console.log('* Adding IFrame')
    document.body.appendChild(iframe);

    // Cleanup function
    return () => {
      console.log('* Removing IFrame')
      document.body.removeChild(iframe);
      document.head.removeChild(style);
      window.removeEventListener("message", () => {});
    };
  }, []);

  return null; // No additional rendering needed
};

export default ChatIframe;
