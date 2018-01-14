import { Platform, AsyncStorage } from 'react-native';

import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from "react-native-fcm";
import Notification from './Notification';

AsyncStorage.getItem('lastNotification').then(data=>{
    if(data){
        //アプリが強制終了された時に通知が来た場合に記録する
        console.log('last notification', JSON.parse(data));
        AsyncStorage.removeItem('lastNotification');
    }
});

export function registerKilledListener(){
    //アプリが終了していてもトリガーされるコールバック
    //AsyncStorageに'lastNotification'の名前でデータをJSONにして保存
    FCM.on(FCMEvent.Notification,notif=>{
        AsyncStorage.setItem('lastNotification',JSON.stringify(notif));
    }); 
}

//アプリがフォアグランドがバックグラウンドで動作している時のみトリガーされる関数
export function registerAppListener(){
    FCM.on(FCMEvent.Notification,notif=>{
        console.log("Notification", notif);
        if(notif.local_notification){
            return;
        }
        if(notif.opened_from_tray){
            return;
        }

        if(Platform.OS === 'ios'){
            switch(notif._notificationType){
                case NotificationType.Remote:
                    console.log('Remote');
                    // Notification.scheduleLocalNotification('リモート通知後のローカル通知スケジュール',(new Date()).getTime() + 5000,'5秒前');
                    notif.finish(RemoteNotificationResult.NewData);
                    break;
                case NotificationType.NotificationResponse:
                    console.log('NotificationResponse');
                    notif.finish();
                    break;
                case NotificationType.WillPresent:
                    if(notif.expire){
                        Notification.scheduleLocalNotification(notif.title,parseInt(notif.expire) - 1000 * 60 * 60 * 3,'3時間前です');
                        Notification.scheduleLocalNotification(notif.title,parseInt(notif.expire) - 1000 * 60 * 60 * 1,'1時間前です');
                        Notification.scheduleLocalNotification(notif.title,parseInt(notif.expire) - 1000 * 60 * 30,'30分前です');
                        Notification.scheduleLocalNotification(notif.title,parseInt(notif.expire),'期限です');
                        Notification.scheduleLocalNotification(notif.title,parseInt(notif.expire) + 1000 * 60 * 30,'期限を30分過ぎてます');
                        Notification.scheduleLocalNotification(notif.title,parseInt(notif.expire) + 1000 * 60 * 60 * 1,'期限を1時間過ぎてます');
                    }                                     
                    notif.finish(WillPresentNotificationResult.All);
                    break;
            }
        }
    });

    //最初の読み込みで利用出来ないトークンをここでキャッチする
    FCM.on(FCMEvent.RefreshToken,token=>{
        console.log("TOKEN (refreshUnsubscribe)",token);
        this.props.onChangeToken(token);
    });

    FCM.enableDirectChannel();

    FCM.on(FCMEvent.DirectChannelConnectionChanged,(data)=>{
        console.log('direct channel connected' + data);
    });
    
    setTimeout(()=>{
        FCM.isDirectChannelEstablished().then(d=>console.log(d));
    },1000);
    
}


