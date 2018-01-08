import FirebaseConstants from "./FirebaseConstants";
import { Alert } from "react-native";
// import { Header } from "../../../../Library/Caches/typescript/2.6/node_modules/@types/react-navigation";

const API_URL = "https://fcm.googleapis.com/fcm/send";

class FirebaseClient {

    async send(body,type){
        console.log(FirebaseConstants.KEY);

        let headers = new Headers({
            'Content-Type':"application/json",
            "Authorization":"key=" + FirebaseConstants.KEY
        });

        try{
            //fcmのAPIにPOSTリクエスト
            let response = await fetch(API_URL,{method:"POST",headers,body});
            console.log(response);
            try{
                if(response.success){
                    Alert.alert('Failed to send notification, check error log');
                }
            }catch(err){
                Alert.alert('Failed to send notification, check error log');
            }
        }catch(err){
            Alert.alert(err && err.message);
        }
    }
}

let firebaseClient = new FirebaseClient();
export default firebaseClient;