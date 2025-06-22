function sendMessage() {
    const MESSAGE = 'bkRedditLogin';

    // Will send a message when the extension is clicked,
    // provided the user is on an allowed site
    browser.runtime.sendMessage({
        type: MESSAGE
    });
}

function listenForMessage() {
    const MESSAGE = 'bkLoggedIn';
    let tokenData = '';
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if(message.type !== MESSAGE) {
            return;
        } else {
            tokenData = browser.storage.local.set(TOKENDATA);
        }
    });
    
    console.log(tokenData);
}

function main() {
    listenForMessage();
    sendMessage();
}

main();