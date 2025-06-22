const MESSAGE = 'bkRedditLogin';

// Will send a message when the extension is clicked,
// provided the user is on an allowed site
browser.runtime.sendMessage({
    type: MESSAGE
});

console.log("Message Sent");