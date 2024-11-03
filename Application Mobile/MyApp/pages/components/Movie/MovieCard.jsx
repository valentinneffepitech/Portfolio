import React from 'react'
import { Image, Pressable, StyleSheet, Text } from 'react-native'

export const MovieCard = ({ navigation, movie, key }) => {
    const poster = movie.poster ? { uri: movie.poster } : require('../assets/404.jpg')

    const config = {
        screen: "movieDetails",
        params: {
            id: movie.id,
        }
    }

    return (
        <Pressable style={styles.card} onPress={() => { navigation.navigate('Films', config) }}>
            <Image
                source={poster}
                style={styles.poster}
            />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    card: {
        width: 150,
        height: 200,
        margin: 2,
        borderRadius: 10,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
        display: 'flex',
        alignItems: 'center'
    },
    poster: {
        width: '100%',
        height: '100%',
    },
    movieTitle: {
        textAlign: 'center'
    }
})