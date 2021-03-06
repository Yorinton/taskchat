import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    DatePickerIOS,
    PickerIOS
} from 'react-native';
import Chat from './Chat';
import {
    Actions,
    ActionConst
} from 'react-native-router-flux';

const styles = StyleSheet.create({
    title: {
        marginTop:20,
        marginLeft:20,
        fontSize:20,
    },
    nameInput: {
        height:40,
        borderWidth:2,
        borderColor:'black',
        margin:20
    },
    buttonText: {
        marginLeft:20,
        fontSize:20,
    }
});


export default class Home extends Component {

    state = {
        name:'',
        date:new Date()
    };

    render() {

        return (
            <View>
                <Text style={styles.title}>Home画面</Text>
                <TextInput
                    placeholder='名前入力'
                    style={styles.nameInput}
                    onChangeText={(text) => {
                        this.setState({
                            name:text,
                        });
                    }}
                    value={this.state.name}
                />
                <TouchableOpacity 
                    onPress={() => {
                        console.log(this.state.name);
                        Actions.Chat({
                            type: ActionConst.PUSH_OR_POP,
                            username:this.state.name,//遷移先のコンポーネントでpropsからアクセス出来る
                        });
                    }}
                >
                    <Text style={styles.buttonText}>To Chat</Text>
                </TouchableOpacity>
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
            </View>
        )
    }
}