chrome.runtime.onInstalled.addListener(()=>{
    chrome.storage.sync.set({censor:"all",blacklist:[]}); // set initial values
});