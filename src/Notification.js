import firebaseClient from "./FirebaseClient";
import FCM from 'react-native-fcm';

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
}

export default new Notification();