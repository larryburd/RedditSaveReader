browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const MESSAGE = 'bkRedditLogin';

    console.log("message recieved");

    if (message.type === MESSAGE) {
        loginToReddit().then(validate);
        return true;
    }
});





// Create a random string with the number of characters supplied as len: int
function generateRandomString(len) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-,_~';
    let res = '';

    for (let i = 0; i < len; i++) {
        res += chars[Math.floor(Math.random() * chars.length)];
    }

    return res;
}

function base64URLEncode(str) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+s/, '');
}

async function SHA256(text) {
    const encorder = new TextEncoder();
    const data = encorder.encode(text);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return hash;
}

async function loginToReddit() {
    const [STATE_LEN, CODEVERIFY_LEN] = [16, 64];
    const CLIENTID = 'ej9rV2pUdu9vI4VMJCDUdA';
    //const SITEREDIRECTURI = 'https://sites.google.com/view/read-it-extension/home';
    const REDIRECTURI = `http://127.0.0.1/mozoauth2/b53ded90afaa60708bc466442e10df566cfbe9e0`;
    const STATE = generateRandomString(STATE_LEN);
    const CODEVERIFIER = generateRandomString(CODEVERIFY_LEN);
    const CODECHALLENGE = base64URLEncode(await SHA256(CODEVERIFIER));

    const AUTHURL = `https://www.reddit.com/api/v1/authorize?` +
        new URLSearchParams({
            client_id: CLIENTID,
            response_type: 'code',
            state: STATE,
            redirect_uri: REDIRECTURI,
            duration: 'permanent',
            scope: 'identity read',
            code_challenge: CODECHALLENGE,
            code_challenge_method: '5256'
        }).toString();
    
    let webflow = browser.identity.launchWebAuthFlow(
        {
            url: AUTHURL,
            interactive: true
        });

    let redirect_url = await Promise.resolve(webflow);
    
    redirectObj = {
        "state": STATE,
        "client_id": CLIENTID,
        "redirect_uri": REDIRECTURI,
        "codeVerifier": CODEVERIFIER,
        "redirect_url": redirect_url
    }

    return redirectObj;
}

async function validate(redirectObj) {
    if (browser.runtime.lastError || !redirectObj.redirect_url) {
                console.error(browser.runtime.lastError);
                return;
            }

            const RURL = new URL(redirectObj.redirect_url);
            const CODE = RURL.searchParams.get('code');
            const RETURNEDSTATE = RURL.searchParams.get('state');

            if (redirectObj.state !== RETURNEDSTATE) {
                console.error('State does not match!');
                return;
            }

            // Exchange the code for a token
            const TOKENRESPONSE = await fetch('https://www.reddit.com/api/v1/access_token', {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + btoa(`${redirectObj.client_id}:`)
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code: CODE,
                    redirect_uri: redirectObj.redirect_uri,
                    code_verifier: redirectObj.codeVerifier
                })
            });

            const TOKENDATA = await TOKENRESPONSE.json();
            console.log('Access token: ', TOKENDATA.access_token)
}