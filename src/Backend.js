import firebase from 'firebase';
import CONFIG from './Config.js';


class Backend {

    uid = '';
    messageRef = null;
    tasksRef = null;
    tokenRef = null;

    constructor() {
        firebase.initializeApp({
            apiKey: CONFIG.API_KEY,
            authDomain: CONFIG.AUTH_DOMAIN,
            databaseURL: CONFIG.DATABASE_URL,
            projectId: CONFIG.PROJECT_ID,
            storageBucket: CONFIG.STORAGE_BUCKET,
            messagingSenderId: CONFIG.MESSAGING_SENDER_ID
        });

        //userのsing-in/outのステータスが変わったタイミングで実行されるオブザーバー(関数)を登録
        //このオブザーバーは認証状態が変わるたびに呼び出される
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

    //タスク書き込み
    registerTask(task){
        this.tasksRef = firebase.database().ref('tasks');
        this.tasksRef.off();//これをやらないとTasksコンポーネントのマウント前にsetStateが実行されてしまう
        this.tasksRef.push({
            id:task.id,
            task: task.text,
            expire: task.expire,
            responsible: task.responsible,
            done:task.done,
            createdAt: firebase.database.ServerValue.TIMESTAMP,
        });
    }

    readTasks(callback){
        this.tasksRef = firebase.database().ref('tasks');
        this.tasksRef.off();

        const onReceive = (dataSnapShot) => {
            const tasks = dataSnapShot.val();
            callback(tasks);
        }

        this.tasksRef.orderByChild('expire').on('value',onReceive);
    }

    readTasksLimit(callback,num){
        this.tasksRef = firebase.database().ref('tasks');
        this.tasksRef.off();

        const onReceive = (dataSnapShot) => {
            const tasks = dataSnapShot.val();
            callback(tasks);
        }

        this.tasksRef.limitToLast(num).on('value',onReceive);
    }

    changeTaskStatus(key,isDone){
        const ref = `tasks/${key}`;
        this.tasksRef = firebase.database().ref(ref);

        this.tasksRef.update({done:isDone});

        this.tasksRef.off();
    }

    deleteTask(key){
        const ref = `tasks/${key}`;
        this.tasksRef = firebase.database().ref(ref);

        this.tasksRef.remove();
        this.tasksRef.off();
    }

    storeToken(token){

        //DB登録済みtoken読み込み
        this.readToken((tokens)=>{
            for(var key in tokens){
                if(tokens[key].token === token){
                    return;
                }
            }
            //if(該当トークンがdbに存在しなければ)
            const tokenRef = firebase.database().ref('token');
            tokenRef.push({
                token:token,
            });
        });
    }

    readToken(callback){
        this.tokenRef = firebase.database().ref('token');
        this.tokenRef.off();

        const onReceive = (dataSnapShot) => {
            const tokens = dataSnapShot.val();
            callback(tokens);
        }

        this.tokenRef.on('value',onReceive);
    }

}

export default new Backend();