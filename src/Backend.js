import firebase from 'firebase';
import CONFIG from './Config.js';


class Backend {

    constructor() {
        firebase.initializeApp({
            apiKey: CONFIG.API_KEY,
            authDomain: CONFIG.AUTH_DOMAIN,
            databaseURL: CONFIG.DATABASE_URL,
            projectId: CONFIG.PROJECT_ID,
            storageBucket: CONFIG.STORAGE_BUCKET,
            messagingSenderId: CONFIG.MESSAGING_SENDER_ID
        });
    }

    //メッセージの読み込み
    loadMessage() {

    }


    //メッセージの書き込み
    writeMessage() {
        
    }

}