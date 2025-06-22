const MESSAGE = 'bkRedditLogin';

browser.runtime.sendMessage({
    type: MESSAGE
});

console.log("Message Sent");