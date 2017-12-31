import firebase from 'firebase';
import CONFIG from './Config.js';


class Backend {

    uid = '';
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

        //userのsing-in/outのステータスが変わったタイミングで実行される関数を実装
        firebase.auth().onAuthStateChanged((user) => {
            if(user){//userが存在する場合、userのuidをセット
                this.setUid(user.uid);
            }else{//userが無い場合は匿名sing-inする
                firebase.auth().signInAnonymously().catch((error) => {
                    alert(error.message);
                });
            }
        });
    }

    setUid(uid) {
        this.uid = uid;
    }

    getUid() {
        return this.uid;
    }

    //メッセージの読み込み
    loadMessages(callback) {
        //messagesへの参照を取得。この時点でデータベース内にmessagesが無い場合は作る
        this.messagesRef = firebase.database().ref('messages');
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
        //参照しているデータに指定したイベント(child_added)が発生した時にonReceiveが実行される
        //onReceiveはDataSnapShotを引数として受け取る
        this.messagesRef.limitToLast(20).on('child_added', onReceive);//limitToLast(20)は無くても大丈夫
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