browser.runtime.onMessage.addListener(getToken);

function getToken() {
    // Retrieves the JWT token from local storage
    browser.storage.local.get().then((tokenData) => {
        console.log('TOKEN: ' + tokenData.access_token);
    });   
}

async function sendMessage() {
    const MESSAGE = 'bkRedditLogin';

    // Will send a message when the extension is clicked,
    // provided the user is on an allowed site
    response = await browser.runtime.sendMessage({
        type: MESSAGE
    });

    if (response) {
        getToken();
    } else {
        console.error("NO TOKEN SET");
    }
}

function main() {
    sendMessage();
}

main();