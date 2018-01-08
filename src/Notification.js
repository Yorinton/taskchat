import firebaseClient from "./FirebaseClient";
import FCM from 'react-native-fcm';
// import React, { Component } from 'react';
import { Platform } from 'react-native';

class Notification{
    //ロカールの通知をスケジューリングする
    scheduleLocalNotification() {
    FCM.scheduleLocalNotification({
        id: 'testnotif',//uniqueにする必要がある
        fire_date: new Date().getTime()+5000,
        title: '1時間前です',
        body: 'ゴミ出し',
        priority: "high",
        show_in_foreground: true,
    });
    }

    setBadgeNumber(num){
        FCM.setBadgeNumber(num);
    }

      //リモートの通知を送信
    sendRemoteNotification(token,value,title) {
        let body;

        if(Platform.OS === 'android'){
            body = {
                "to": token,
                "data":{
                        "custom_notification": {
                            "title": title,
                            "body": value,
                            "sound": "default",
                            "priority": "high",
                            "show_in_foreground": false
                    }
                    },
                    "priority": 10
            }
        } else {
                body = {
                    "to": token,
                    "notification":{
                        "title": title,
                        "body": value,
                        "sound": "default",
                        "show_in_foreground": false
                    },
                    "priority": 10
                }
            }

        firebaseClient.send(JSON.stringify(body), "notification");
    }

}

export default new Notification();