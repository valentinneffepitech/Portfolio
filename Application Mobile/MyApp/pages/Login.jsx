import React, { useContext, useState } from 'react'
import AuthContext from '../contexts/AuthContext';
import {
    View,
    TextInput,
    StyleSheet,
    Text,
    Pressable,
    SafeAreaView,
    Linking
} from 'react-native';
import { authentication } from '../API/Tools';
import CryptoJS from 'crypto-js';

export const Login = ({ navigation }) => {

    const { user, authenticate, country } = useContext(AuthContext)

    const [datas, setDatas] = useState({
        login: "",
        password: ""
    });

    const prepareToAuth = async () => {
        let password = CryptoJS.MD5(datas.password).toString();
        let login = datas.login;
        const response = await authentication({ login: login, password: password.trim() });
        if (response.user) {
            authenticate(response.user.login,
                response.token,
                response.hash
            )
            navigation.goBack();
        } else {
            alert("Les informations semblent erronées")
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>
                WikiMovie
            </Text>
            <View>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    onChangeText={(text) => setDatas({ ...datas, login: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(text) => setDatas({ ...datas, password: text })}
                />
                <Pressable style={styles.button} onPress={() => prepareToAuth()}>
                    <Text style={styles.buttonText}>
                        Se connecter
                    </Text>
                </Pressable>
                <Text style={{
                    color: '#f6f6f6',
                    fontSize: 16,
                    textAlign: 'center',
                    marginTop: 30,
                    textDecorationColor: '#f6f6f6',
                    textDecorationLine: "underline",
                    fontStyle: "italic"
                }}
                    onPress={() => {
                        console.log('https://www.betaseries.com/' + country.toLowerCase() != 'fr' ? country.toLowerCase() + "/" : "" + 'inscription/')
                        return Linking.openURL('https://www.betaseries.com/' + (country.toLowerCase() != 'fr' ? country.toLowerCase() + "/" : "") + 'inscription/')
                    }}
                >
                    Pas encore de compte ?
                </Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    input: {
        margin: 20,
        backgroundColor: "#e2e2e2",
        color: "#252525",
        fontWeight: "400",
        padding: 10,
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 1,
        width: "100%",
        alignSelf: "center"
    },
    container: {
        flex: 1,
        backgroundColor: "#252525",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "10%",
    },
    title: {
        color: "#fff",
        fontSize: 40,
        textAlign: "center",
        marginBottom: 100
    },
    button: {
        backgroundColor: "#7699d4",
        padding: 10,
        width: "80%",
        marginLeft: "10%",
        marginTop: 100,
        borderRadius: 10,
    },
    buttonText: {
        color: "#f6f6f6",
        textAlign: "center",
        fontSize: 20,
    },
})