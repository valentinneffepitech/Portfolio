import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AuthContext from '../../../contexts/AuthContext';
import { getList } from '../../../API/Tools';
import { SerieCard } from '../Series/SerieCard';
import { FlatList } from 'react-native';
import { MovieCard } from '../Movie/MovieCard';
import { StyleSheet } from 'react-native';

export const Library = ({ navigation }) => {

    const [movies, setMovies] = useState(false);
    const [shows, setShows] = useState(false);

    const { user, update } = useContext(AuthContext);

    const retrieveDatas = async (type) => {
        const response = await getList(type, user.token);
        switch (type) {
            case 'movies':
                setMovies(response.movies);
                break;
            case 'shows':
                setShows(response.shows);
                break;
        }
    }

    useEffect(() => {
        retrieveDatas('shows');
        retrieveDatas('movies');
    }, [update])

    return (
        <SafeAreaView>
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f0f0f0'
                }}
            >
                <Text
                    style={{
                        fontSize: 24,
                        color: '#333',
                        fontWeight: 'bold',
                        paddingVertical: 20
                    }}
                >Mes Séries et films</Text>
            </View>
            <View
                style={{
                    height: "90%",
                    justifyContent: "space-around",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Text
                    style={styles.subTitles}
                >Mes séries</Text>
                {
                    (shows && shows.length !== 0) ?
                        <FlatList
                            data={shows}
                            renderItem={({ item }) => (
                                <SerieCard
                                    movie={item}
                                    navigation={navigation}
                                    key={item.id}
                                />
                            )}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal
                            contentContainerStyle={{
                                gap: 30,
                            }}
                        />
                        :
                        <Text
                            style={styles.noResults}
                        >
                            Vos séries s'afficheront ici...
                        </Text>
                }
                <Text
                    style={styles.subTitles}
                >Mes films</Text>
                {
                    (movies && movies.length != 0) ?
                        <FlatList
                            data={movies}
                            renderItem={({ item }) => (
                                <MovieCard
                                    movie={item}
                                    navigation={navigation}
                                    key={item.id}
                                />
                            )}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal
                            contentContainerStyle={{
                                gap: 30,
                            }}
                        /> :
                        <Text
                            style={styles.noResults}
                        >
                            Vos films s'afficheront ici...
                        </Text>
                }
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    noResults: {
        textAlign: "center",
        fontSize: 18,
        color: '#333',
        paddingVertical: 10,
        marginVertical: 30,
        fontStyle: "italic",
    },
    subTitles: {
        fontSize: 18,
        color: '#333',
        paddingVertical: 10,
        paddingHorizontal: 20
    }
})