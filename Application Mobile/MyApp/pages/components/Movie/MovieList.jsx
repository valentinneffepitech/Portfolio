import React, { useContext, useEffect, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView, ScrollView, Text, TextInput } from 'react-native'
import { Header } from '../Header';
import AuthContext from '../../../contexts/AuthContext';
import { getAllMovies } from '../../../API/Tools';
import { MovieCard } from './MovieCard';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const MovieList = ({ navigation }) => {

    const limit = 20;
    const [offset, setOffset] = useState(0);
    const [movies, setMovies] = useState([]);
    const [showMore, setShowMore] = useState(true);

    const { country } = useContext(AuthContext);

    const manageCountries = async () => {
        const response = await getAllMovies('movies', limit, offset, country.toLowerCase());

        if (response.movies) {
            setMovies(prev => (
                [...prev, ...response.movies]
            ))
            setShowMore(true);
        }
    }

    useEffect(() => {
        manageCountries();
    }, [offset])

    return (
        <SafeAreaView>
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    Les films les plus populaires
                </Text>
            </View>
            <ScrollView contentContainerStyle={styles.grid}>
                {
                    movies.length != 0 && movies.map(movie => (
                        <MovieCard key={movie.id} navigation={navigation} movie={movie} />
                    ))
                }
                {
                    showMore && (
                        <Pressable style={styles.button} onPress={() => {
                            setShowMore(false);
                            setOffset(prev => prev + 20);
                        }}>
                            <Text>
                                Charger plus
                            </Text>
                        </Pressable>
                    )
                }
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    grid: {
        display: "flex",
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: "100%",
        justifyContent: "space-evenly",
        gap: 20,
        paddingTop: 30,
        paddingBottom: 120,
    },
    button: {
        color: "#1d1d1d",
    },
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 30,
        backgroundColor: "#e2e2e2",
    },
    headerText: {
        color: "#1d1d1d",
        fontSize: 20,
        fontWeight: "bold",
    }
})
