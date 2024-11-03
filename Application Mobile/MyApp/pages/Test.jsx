import React, { useState, useEffect, useContext } from 'react'
import { Button, Text } from 'react-native';
import { SafeAreaView } from 'react-native'
import { getCountry } from '../API/Tools'

export const Test = (props) => {

    const [location, setLocation] = useState(false);

    return (
        <SafeAreaView>
            <Button title='test' onPress={() => props.navigation.navigate("serieDetails", { screen: 'Details' })} />
            <Text>
                {
                    JSON.stringify(props)
                }
            </Text>
        </SafeAreaView>
    )
}
