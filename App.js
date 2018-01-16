/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  TextInput,
  ScrollView,
  Image,
  Clipboard,
  TouchableOpacity
} from 'react-native';
import TodoInput from './src/component/TodoInput';
import TodoItem from './src/component/TodoItem';
import { StackNavigator } from 'react-navigation';
import Profile from './src/component/Profile';
import Home from './src/component/Home';
import Chat from './src/component/Chat';
import Tasks from './src/component/Tasks';
import {
  Router,
  Scene,
  Tabs
} from 'react-native-router-flux';
import FCM from 'react-native-fcm';
import {registerKilledListener, registerAppListener} from "./src/Listeners";
import firebaseClient from "./src/FirebaseClient";
import Backend from "./src/Backend";
import Notification from './src/Notification'; 

registerKilledListener();

//親コンポーネント
export default class App extends Component<{}> {

  constructor(props){
    super(props);

    this.state = {
      token:"",
      tokenCopyFeedback:"",
    };//オブジェクトリテラル
  }

  //コンポーネントがマウントされた時の処理(トークン取得や通知許可等)
  async componentDidMount() {
    //Listnerを登録
    registerAppListener();

    //タスクの削除イベントをリッスン
    Backend.listenTaskDeleted((task)=>{
        //通知を削除
        console.log('削除するタスクのid',task.id);
        this.deleteScheduledNotif(task.id);
    });

    //タスクステータスの更新イベントをリッスン
    Backend.listenTaskDone((task)=>{
        console.log(task.done);
        if(task.done){
            console.log('doneしたたスクid',task.id);
            this.deleteScheduledNotif(task.id);
        }
    });


    //初期通知を取得？通知をクリックしてアプリを起動した時に実行される
    //通知内容をinitNotif(初期通知)stateに設定
    FCM.getInitialNotification().then(notif => {
      this.setState({
        initNotif: notif,
      })
    });

    //初回起動時にユーザーに通知の許可をもらう
    try {
      let result = await FCM.requestPermissions({badge:false,sound:true,alert:true});
    }catch(e){
      console.log(e);
    }

    //FCMトークンの取得(パーミッション許可した時にトリガーされる)
    FCM.getFCMToken().then(token => {
      console.log("TOKEN (getFCMToken)", token);
      //tokenをfirebaseのrealtimedatabaseに保存
      Backend.storeToken(token);

      this.setState({
        token: token || "",//tokenに取得したtokenをセット
      })
    });

    //APNsトークンの取得
    if(Platform.OS === "ios"){
      FCM.getAPNSToken().then(token => {
        console.log("APNS TOKEN (getFCMToken)", token);
      });
    }
  }

  deleteScheduledNotif(notifId) {
      Notification.deleteScheduledNotif(notifId);
  }

  //ローカルの通知を表示
  showLocalNotification(){
    FCM.presentLocalNotification({
      vibrate: 500,
      title: 'Hello',
      body: 'Test Notification',
      big_text: 'i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large',
      priority: "high",
      sound: "bell.mp3",
      large_icon: "https://image.freepik.com/free-icon/small-boy-cartoon_318-38077.jpg",
      show_in_foreground: true,
      group: 'test',
      number: 10
    });
  }

  //ロカールの通知をスケジューリングする
  scheduleLocalNotification() {
    FCM.scheduleLocalNotification({
      id: 'testnotif',//uniqueにする必要がある
      fire_date: new Date().getTime()+5000,
      // vibrate: 500,
      title: 'Hello',
      body: 'Test Scheduled Notification',
      // sub_text: 'sub text',
      priority: "high",
      // large_icon: "https://image.freepik.com/free-icon/small-boy-cartoon_318-38077.jpg",
      show_in_foreground: true,
      // picture: 'https://firebase.google.com/_static/af7ae4b3fc/images/firebase/lockup.png',
      // wake_screen: true
    });
  }

  //リモートの通知を送信
  sendRemoteNotification(token) {
    let body;

    if(Platform.OS === 'android'){
      body = {
        "to": token,
      	"data":{
					"custom_notification": {
						"title": "Simple FCM Client",
						"body": "This is a notification with only NOTIFICATION.",
						"sound": "default",
						"priority": "high",
						"show_in_foreground": true
        	}
    		},
    		"priority": 10
      }
    } else {
			body = {
				"to": token,
				"notification":{
					"title": "Simple FCM Client",
					"body": "This is a notification with only NOTIFICATION.",
					"sound": "default"
				},
				"priority": 10
			}
		}

    firebaseClient.send(JSON.stringify(body), "notification");
  }

  //リモート通知をデータ付きで送る
  sendRemoteNotificationWithData(token) {
    let body = {
      "to": token,
      "notification":{
    		"title": "Simple FCM Client",
    		"body": "This is a notification with NOTIFICATION and DATA (NOTIF).",
				"sound": "default"
    	},
    	"data":{
    		"hello": "there"
    	},
    	"priority": "high"
    }

    firebaseClient.send(JSON.stringify(body), "notification-data");
  }

  render() {

    let {
      token,
      tokenCopyFeedback
    } = this.state;

    return (
      // <View style={styles.container}>
      //   <Text selectable={true} onPress={() => this.setClipboardContent(this.state.token)} style={styles.instructions}>
      //     Token: {this.state.token}
      //   </Text>
      //   <Text>Init notif:{JSON.stringify(this.state.initNotif)}</Text>
      //   <TouchableOpacity onPress={() => this.sendRemoteNotification(token)} style={styles.button}>
      //     <Text style={styles.buttonText}>Send Remote Notification</Text>
      //   </TouchableOpacity>
      //   <TouchableOpacity onPress={() => this.scheduleLocalNotification()} style={styles.button}>
      //     <Text style={styles.buttonText}>Schedule Notification in 5s</Text>
      //   </TouchableOpacity>
      // </View>

      <Router>
        <Scene key='root' style={{paddingTop: Platform.OS === 'ios' ? 64 :54}}>
          {/* <Scene key='Home' component={Home} title='ホーム'/> */}
          <Scene key='Chat' component={Chat} title='チャット'/>     
          <Scene key='Tasks' component={Tasks} title='タスク一覧'/>     
        </Scene>
      </Router>
      // <Router>
      //   <Tabs key='root' style={{paddingTop: Platform.OS === 'ios' ? 64 :54}}>
      //     <Scene key='Home' component={Home} title='ホーム' tabBarLabel='home'/>
      //     <Scene key='Chat' component={Chat} title='チャット' tabBarLabel='chat'/>     
      //     <Scene key='Tasks' component={Tasks} title='タスク一覧' tabBarLabel='task'/>     
      //   </Tabs>
      // </Router>
      // <SimpleApp>
      // <View style={styles.container}>
      //   <View style={styles.main}>
      //     <TodoInput onPressProp={this._onPress}/>
      //     <View style={styles.todoListContainer}>
      //       <FlatList
      //         style={styles.todoList}
      //         data={list}//レンダリングしたい配列
      //         renderItem={({item,index}) => <TodoItem
      //           //item = list,index = listに振られたkey(0,1,2,3...)
      //           onDelete={this._delete(index)}
      //           onDone={this._done(index)}
      //           keyCode={item.key}
      //           {...item}//itemは複数になる可能性があるので可変長引数
      //          />
      //         }//TodoItemコンポーネントの引数にitemを指定
      //       />
      //     </View>
      //   </View>
      // </View>
      // </SimpleApp>
    );
  }

  setClipboardContent(text) {
    Clipboard.setString(text);
    this.setState({tokenCopyFeedback: "Token copied to clipboard."});
    setTimeout(() => {this.clearTokenCopyFeedback()}, 2000);
  }

  clearTokenCopyFeedback() {
    this.setState({tokenCopyFeedback: ""});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#333',
    paddingTop: 40,
    alignItems: 'center',
  },
  main: {
    flex: 1,
    maxWidth: 400,
    alignItems: 'center',
  },
  todoListContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  todoList: {
    paddingLeft: 10,
    paddingRight: 10,
  }
});
