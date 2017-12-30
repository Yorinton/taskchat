import firebase from 'firebase';
import CONFIG from './Config.js';


class Backend {

    messageRef = null;

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
    loadMessages(callback) {
        this.messagesRef = firebase.database().ref('messages');//messagesへの参照を取得
        this.messagesRef.off();//以前アタッチされたコールバックをデタッチする

        //読み込んだDataSnapShotから値を取り出し、loadMessagesの引数であるcallbackの引数に設定して実行
        const onReceive = (data) => {//dataはsnapshot
            const message = data.val();//DataSnapShotから値を抽出
            callback({//引数に与えられたcallback
                //messageの値
                _id:data.key,
                text:message.text,
                createdAt:new Date(message.createdAt),
                user: {
                    _id:message.user._id,
                    name:message.user.name,
                },
            });
        };
        //最新20件のメッセージを取得
        //指定したイベント(child_added)が発生した時にonReceiveが実行される
        //onReceiveはDataSnapShotを引数として受け取る
        this.messagesRef.limitToLast(20).on('child_added', onReceive);
    }


    //メッセージの書き込み
    sendMessage(message) {
        for(let i = 0;i < message.length; i++){
            this.messagesRef.push({
                text: message[i].text,
                user: message[i].user,
                createdAt: firebase.database.ServerValue.TIMESTAMP,
            });
        }
    }

}

export default new Backend();