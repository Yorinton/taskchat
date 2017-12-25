import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
} from 'react-native';
import Chat from './Chat';
import {
    Actions
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
        txt:'',
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
                            txt:text,
                        });
                    }}
                    value={this.state.txt}
                />
                <TouchableOpacity 
                    onPress={() => {
                        console.log(this.state.txt);
                        Actions.Chat({
                            txt:this.state.txt,//遷移先のコンポーネントでpropsからアクセス出来る
                        });
                    }}
                >
                    <Text style={styles.buttonText}>To Chat</Text>
                </TouchableOpacity>
            </View>
        )
    }
}