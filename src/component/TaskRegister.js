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

export default class TaskRegister extends Component {

    constructor(props) {
        super(props)

        this.ref = {};

        this.task = {
            text:'',
            expire:this.state.date.getTime()
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
        if(this.ref._lastNativeText){
            this.task['text'] = this.ref._lastNativeText;
            this.task['expire'] = this.state.date.getTime();
            Backend.registerTask(this.task);
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