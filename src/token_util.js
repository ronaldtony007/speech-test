import axios from 'axios';
import Cookie from 'universal-cookie';

export async function getTokenOrRefresh() {
    const cookie = new Cookie();
    const speechToken = cookie.get('speech-token');

    if (speechToken === undefined) {
        try {
            const speechKey = process.env.REACT_APP_SPEECH_KEY;
            const speechRegion = process.env.REACT_APP_SPEECH_REGION;
            let token = ""
            let region = ""

            if (speechKey === 'paste-your-speech-key-here' || speechRegion === 'paste-your-speech-region-here') {
                console.err('You forgot to add your speech key or region to the .env file.');
            } else {
                try {
                    const headers = { 
                        headers: {
                            'Ocp-Apim-Subscription-Key': speechKey,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    };

                    const tokenResponse = await axios.post(`https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, null, headers);
                    token = tokenResponse.data;
                    region = speechRegion;
                    cookie.set('speech-token', region + ':' + token, {maxAge: 540, path: '/'});
                } catch (err) {
                    console.err('There was an error authorizing your speech key.');
                }
            } 

            console.log('Token fetched from back-end: ' + token);
            return { authToken: token, region: region };
        } catch (err) {
            console.log(err.response.data);
            return { authToken: null, error: err.response.data };
        }
    } else {
        console.log('Token fetched from cookie: ' + speechToken);
        const idx = speechToken.indexOf(':');
        return { authToken: speechToken.slice(idx + 1), region: speechToken.slice(0, idx) };
    }
}