import React from "react";
import { createRoot } from "react-dom/client";

const Popup = () => {
  const checkWebsite = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          {
            action: "checkWebsite",
          },
          (msg) => {
            console.log("result message:", msg);
          }
        );
      }
    });
  };

  return (
    <>
      <button onClick={() => checkWebsite()} style={{ marginRight: "5px" }}>
        check site health
      </button>
    </>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
