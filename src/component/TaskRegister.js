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

export default class TaskRegister extends Component {

    constructor(props) {
        super(props)

        this.ref = {};

        this.ref_res = {};

        this.task = {
            text:'',
            expire:this.state.date.getTime(),
            responsible:'',
            done:false
        };
    }

    state = {
        date:new Date()
    };

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
            this.task['text'] = this.ref._lastNativeText;
            this.task['expire'] = this.state.date.getTime();
            this.task['responsible'] = this.ref_res._lastNativeText;
            Backend.registerTask(this.task);
            //自分の端末に通知
            Notification.scheduleLocalNotification(this.task['text'],this.task['expire'] - 1000 * 60 * 60 * 3,'3時間前です');
            Notification.scheduleLocalNotification(this.task['text'],this.task['expire'] - 1000 * 60 * 60 * 1,'1時間前です');
            Notification.scheduleLocalNotification(this.task['text'],this.task['expire'] - 1000 * 60 * 30,'30分前です');
            Notification.scheduleLocalNotification(this.task['text'],this.task['expire'],'期限です');
            Notification.scheduleLocalNotification(this.task['text'],this.task['expire'] + 1000 * 60 * 30,'期限を30分過ぎてます');
            Notification.scheduleLocalNotification(this.task['text'],this.task['expire'] + 1000 * 60 * 60 * 1,'期限を1時間過ぎてます');
            
            //相手の端末に通知
            Backend.readToken((data)=>{
                for(var key in data){
                    Notification.sendRemoteNotificationWithData(
                        data[key].token,
                        this.task['text'],
                        '新しいタスク',
                        {
                            expire:this.task['expire'],
                            title:this.task['text']
                        }
                    );                    
                    // Notification.sendRemoteNotification(data[key].token,this.task['text'],'新しいタスク');
                }
            });
            Notification.setBadgeNumber(1);
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