import React, { Component } from 'react';
import { Image,View,Text } from 'react-native';


//子コンポーネント
class Name extends Component {

    constructor(props){
        super(props);

        //各メソッドで使える変数 this.props.○○○でアクセス
        const {
            children,
            age,
        } = this.props;

        this.state = {
            showText:true,
        }

        setInterval(()=>{
            this.setState(previousState => {
                return { showText: !previousState.showText };
            });
        },1000);
    }

    render() {
        //renderメソッド内のみの変数 ○○○(変数名のみ)でアクセス
        // const {
        //     children,
        // } = this.props;

        let display = this.state.showText ? `My name is ${this.props.children} / ${this.props.age} years old` : '';

        return (
            <Text>{display}</Text>
        );
    }
}

//親コンポーネント
export default class Profile extends Component {
    render() {
        const pic = {
            url:'https://peeech.s3.us-east-2.amazonaws.com/profiles/2-1512472489-php1FQ8bH.png',//picオブジェクトのプロパティにurlを設定
        };

        return (
            <View>
                <View style={{flex:1,flexDirection:'row',justifyContent: 'flex-end',alignItems: 'center'}}>
                    <Image source={pic} style={{width: 50,height:50}}/>
                    <Image source={pic} style={{width: 50,height:50}}/>
                    <Image source={pic} style={{width: 50,height:50}}/>
                </View>
                <Name age='30'>里織</Name>
                <Name age='30'>ヨリヒロ</Name>
            </View>
        );
    }
}