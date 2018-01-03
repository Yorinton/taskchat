import React, {Component} from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {
    GiftedChat
} from 'react-native-gifted-chat';
import Backend from '../Backend.js';
import TaskButton from './TaskButton';

export default class Chat extends Component {

    state = {
        messages:[],
    };


    componentWillMount() {
        this.setState({
            visibleModal:false,
        });
    }

    // onSend = (messages = []) => {
    //     this.setState((previousState) => ({
    //         messages: GiftedChat.append(previousState.messages, messages),
    //     }));
    // }

    render() {
        return (
            <GiftedChat
                messages={this.state.messages}
                onSend={(message) => {
                    Backend.sendMessage(message);
                }}
                user={{
                    _id: Backend.getUid(),//uidで自分か相手かを判別
                    name: this.props.username,//名前を設定するとアバターに表示される
                }}
                renderActions={()=>this.renderActions()}
                renderChatFooter={()=>this.renderChatFooter()}
            >
            <Modal
                visible={this.state.visibleModal}
                transparent={true}
                animationType={'fade'}
            >
                <View style={styles.container}>
                    <Text
                        style={styles.modal}
                    >
                        Modal
                    </Text>
                    <TouchableOpacity
                        onPress={()=>{
                            this.setState({
                                visibleModal:false
                            })
                        }}
                    >
                        <Text>cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            </GiftedChat>
        );
    }

    cancel() {
        this.setState(()=>{
            return {
                visibleModal: false
            };
        });
    }

    renderChatFooter() {
        return (
            <TaskButton
                onPress={()=>this.setState({
                    visibleModal:true
                })}
            />
        );
    }

    renderActions() {
        return (
            <TaskButton
                onPress={()=>this.setState({
                    visibleModal:true
                })}
            />
        );
    }
    //renderメソッドの内容がレンダリングされた時
    componentDidMount() {
        //メッセージ読み込みの際に実行するコールバック関数を引数に渡している
        Backend.loadMessages((message) => {//firebaseからロードしてきたmessageをstateのmessagesに追加
            this.setState((previousState) => {//stateを更新 + 再度レンダリング
                return {
                    //前のStateのmessagesに引数のmessageを追加
                    messages: GiftedChat.append(previousState.messages, message),
                };
            });
        });
    }

    //別ページに遷移した時
    componentWillUnmount() {

    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center'
    },
    modal: {
        fontSize:50,
    }
});
