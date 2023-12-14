import RuleEngine from "./rule";
import Website from "./website";

chrome.runtime.onMessage.addListener(async function (
  msg,
  sender,
  sendResponse
) {
  if (msg.action === "checkWebsite") {
    const website = new Website(document).toJSON();
    const ruleEngine = new RuleEngine();

    const result = await ruleEngine.checkWebsite(website);
    console.log("result", result);
    if (result.status === "flagged") {
      document.body.style.backgroundColor = "#00ff00";
    }

    if (result.status === "false_positive") {
      document.body.style.backgroundColor = "#ff0000";
    }
    sendResponse(result);
  }

  return true;
});
