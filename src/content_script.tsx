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
    if (result.status) {
      document.body.style.backgroundColor = "#00ff00";
    }
    sendResponse(result);
  }

  return true;
});
