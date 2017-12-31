import React, {Component} from 'react';
import {
    View,
    Text,
} from 'react-native';
import {
    GiftedChat
} from 'react-native-gifted-chat';
import Backend from '../Backend.js';

export default class Chat extends Component {

    constructor() {
        super();

        this.setId();
    }

    state = {
        messages:[],
    };

    setId() {
        this.uid = (new Date()).getTime();
        console.log(this.uid);
    }

    componentWillMount() {

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
                    _id: this.uid,//uidで自分か相手かを判別
                    name: this.props.username,
                }}
            />
        )
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
