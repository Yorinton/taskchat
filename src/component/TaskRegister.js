import React, {Component} from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    DatePickerIOS
} from 'react-native';
import Backend from '../Backend.js';
import Notification from '../Notification';
import FCM from 'react-native-fcm';
import uniqueId from '../Utility';

export default class TaskRegister extends Component {

    constructor(props) {
        super(props)

        this.ref = {};

        this.ref_res = {};

        this.task = {
            id:'',
            text:'',
            expire:this.state.date.getTime(),
            responsible:'',
            done:false
        };
    }

    state = {
        date:new Date(),
        token:""
    };


    componentWillMount() {
        FCM.getFCMToken().then(token => {
            console.log("TOKEN (getFCMToken)", token);

            this.setState({
              token: token,//tokenに取得したtokenをセット
            })
        });
    }

    render(){

        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.textInput}
                    placeholder='タスク入力'
                    ref={(input)=>{this.ref = input;}}
                />
                <DatePickerIOS
                    date={this.state.date}
                    onDateChange={(date)=>{
                        this.setState(()=>{
                            return{
                                date:date,
                            }
                        });
                    }}
                    mode='datetime'
                    style={styles.picker}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder='担当者'
                    ref={(input)=>{this.ref_res = input;}}
                />
                <TouchableOpacity
                    onPress={()=>this.registerTask()}
                >
                    <Text>register</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={()=>this.props.onPress()}
                >
                    <Text>cancel</Text>
                </TouchableOpacity>
            </View>
        );
    }

    registerTask(){
        if(this.ref._lastNativeText && this.ref_res._lastNativeText){

            //タスクをdbに保存
            const notifId = uniqueId();
            this.task['id'] = notifId;
            this.task['text'] = this.ref._lastNativeText;
            this.task['expire'] = this.state.date.getTime();
            this.task['responsible'] = this.ref_res._lastNativeText;
            Backend.registerTask(this.task);

            //自分の端末に通知
            //idが重複すると上書きされるため-3h等の文字列をつける
            Notification.scheduleLocalNotification(`${this.task['id']}-3h`,this.task['text'],this.task['expire'] - 1000 * 60 * 60 * 3,'3時間前です');
            Notification.scheduleLocalNotification(`${this.task['id']}-1h`,this.task['text'],this.task['expire'] - 1000 * 60 * 60 * 1,'1時間前です');
            Notification.scheduleLocalNotification(`${this.task['id']}-0.5h`,this.task['text'],this.task['expire'] - 1000 * 60 * 30,'30分前です');
            Notification.scheduleLocalNotification(`${this.task['id']}+0h`,this.task['text'],this.task['expire'],'期限です');
            Notification.scheduleLocalNotification(`${this.task['id']}+0.5h`,this.task['text'],this.task['expire'] + 1000 * 60 * 30,'期限を30分過ぎてます');
            Notification.scheduleLocalNotification(`${this.task['id']}+1h`,this.task['text'],this.task['expire'] + 1000 * 60 * 60 * 1,'期限を1時間過ぎてます');
            
            //相手の端末に通知
            Backend.readToken((data)=>{

                for(var key in data){
                    // console.log('自分のtoken',this.state.token);
                    // console.log('通知先のtoken',data[key].token);
                    if(this.state.token !== data[key].token){
                        Notification.sendRemoteNotificationWithData(
                            data[key].token,
                            this.task['text'],
                            '新しいタスク',
                            {
                                id:this.task['id'],
                                expire:this.task['expire'],
                                title:this.task['text']
                            }
                        );
                    }                  
                }
            });
            Notification.setBadgeNumber(1);
            //タスク入力欄をリセット
            this.ref.setNativeProps({text:''});
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
    },
    picker: {
        width:300,
    }
    // modal: {
    //     fontSize:20,
    // },
    // textInput: {
    //     height:50,
    //     backgroundColor: '#FFF',
    // },
    // buttons: {
    //     flex:1,
    //     flexDirection:'row',
    //     justifyContent:'space-between',
    // }
});