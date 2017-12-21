import React, { Component } from 'react';//React.ComponentをComponentとして宣言
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      padding: 20,
    },
    textInput: {
      flex: 3,
      backgroundColor: '#FFF',
      marginRight: 5,
    },
    button: {
      flex: 1,
      backgroundColor: '#008080',
      marginLeft: 5,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 10,
      paddingBottom: 10,
    },
    buttonText: {
      color: '#FFF',
      fontWeight: '500',
    }
});

export default class TodoInput extends Component {//Reactのコンポーネントを外部から読み込み

    constructor(props){
        super(props);

        this.ref = {};//refを初期化(オブジェクトリテラル)
    
    }

    // 親から渡された関数をラップして処理を加えた関数を新たに定義
    _onPressChild = () => {
        this.props.onPressProp(this.ref._lastNativeText);//onPressで渡された親の_onPressに入力値を渡す
        this.ref.setNativeProps({ text:'' });
    }

    render() {//ここでreturnされたものが表示される

        //onPressという名前で送られてきた関数をthis.propsに設定し、this.props.onPressとして扱えるようにする
        // const {
        //     onPress,
        // } = this.props;

        return (
            <View style={styles.container}>
                <TextInput 
                    style={styles.textInput}
                    ref={(input) => { this.ref = input; }}//入力値を受け取りthis.refにセット refを使うことでTextInputに関する情報を取得出来る
                />
                <TouchableOpacity 
                    style={styles.button}
                    onPress={this._onPressChild}//TouchableOpacityのpropsであるonPressを使って再定義した_onPressChildメソッドを実行
                >
                    <Text style={styles.buttonText}>追加</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
  