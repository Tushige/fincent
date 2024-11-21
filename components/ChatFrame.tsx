
'use client';
import { useEffect } from 'react';
    
const ChatIframe = () => {
  useEffect(() => {
    const iframe = document.createElement('iframe');
    const style = document.createElement('style');
    const domainId = "2c0aa5d4-80bc-448c-a056-09717ddb4a5d";
    
    style.textContent = `
      .chat-frame {
        position: fixed;
        right: 0;
        bottom: 0;
        border: none;
        width: 100%;
        height: 100%;
        z-index: 1000;
      }
      @media (min-width: 769px) {
        .chat-frame {
          right: 50px;
          bottom: 50px;
          width: 400px;
          height: 600px;
        }
      }
    `;

    // iframe.src = "https://chatai-gen.vercel.app//chatbot/bdcfd400-63a3-44bd-a8cd-7a4ea6c08995"
    iframe.src = "http://localhost:3000/chatbot/bdcfd400-63a3-44bd-a8cd-7a4ea6c08995"
    iframe.className = "chat-frame";

    document.head.appendChild(style);
    document.body.appendChild(iframe);

    window.addEventListener("message", (e) => {
      // if (e.origin !== "https://chatai-gen.vercel.app/") return;
      if (e.origin !== "https://localhost:3000") return;
      let dimensions = JSON.parse(e.data);
      iframe.width = dimensions.width;
      iframe.height = dimensions.height;
      // iframe.contentWindow.postMessage("bdcfd400-63a3-44bd-a8cd-7a4ea6c08995", "https://chatai-gen.vercel.app/")
      iframe.contentWindow.postMessage("bdcfd400-63a3-44bd-a8cd-7a4ea6c08995", "http://localhost:3000/")
    });

    return () => {
      document.body.removeChild(iframe);
      document.head.removeChild(style);
      window.removeEventListener("message", () => {});
    };
  }, []);

  return null;
};

export default ChatIframe;
