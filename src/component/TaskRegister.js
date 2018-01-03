import React, {Component} from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    TextInput
} from 'react-native';

export default class TaskRegister extends Component {
    render(){
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.textInput}
                    placeholder='タスク入力'
                ></TextInput>
                <View style={styles.buttons}>
                    <TouchableOpacity>
                        <Text>register</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=>this.props.onPress()}
                    >
                        <Text>cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
    },
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