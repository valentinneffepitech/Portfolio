import React, { useEffect, useState } from 'react'
import { Gyroscope } from "expo-sensors";
import { Image, Pressable, StyleSheet, Text } from 'react-native';
import { View } from 'react-native';

export const Gyroimage = ({ path, search }) => {

    const [{ x, y, z }, setData] = useState({
        x: 0,
        y: 0,
        z: 0
    })

    const _fast = () => Gyroscope.setUpdateInterval(16);

    const [subscription, setSubscription] = useState(null);

    const _subscribe = () => {
        Gyroscope.setUpdateInterval(10);
        setSubscription(
            Gyroscope.addListener(gyroscopeData => {
                setData(gyroscopeData);
            })
        );
        console.log('fonctionne')
    };

    const _unsubscribe = () => {
        subscription && subscription.remove();
        setSubscription(null);
        console.log("fonctionne pas")
    };

    useEffect(() => {
        _subscribe();
        return () => _unsubscribe();
    }, []);


    const styles = StyleSheet.create({
        poster: {
            width: search ? 60 : "40%",
            aspectRatio: "3/4",
            marginHorizontal: 30,
            marginVertical: 40,
            transform: [
                { rotateY: -y.toFixed(2) * 10 + 'deg' },
                { rotateX: x.toFixed(2) * 10 + 'deg' },
                { translateY: -x.toFixed(2) * 10 },
                { translateX: y.toFixed(2) * 10 },
            ],
        },
    })

    return (
        <View
            style={styles.poster}
        >
            <Image
                source={
                    path ?
                        {
                            uri: path
                        } :
                        require('../assets/404.jpg')
                }
                style={{
                    height: "100%",
                    borderRadius: 20
                }}
            />
        </View>
    )
}
