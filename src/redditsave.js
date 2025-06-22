browser.runtime.onMessage.addListener(getToken);

function getToken() {
    let tokenData = '';

    tokenData = browser.storage.local.get("access_token");
    console.log('TOKEN: ' + JSON.stringify(tokenData));
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