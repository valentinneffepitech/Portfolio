import React, { useContext, useEffect, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView, ScrollView, Text, TextInput } from 'react-native'
import AuthContext from '../../../contexts/AuthContext';
import { getAllMovies } from '../../../API/Tools';
import { SerieCard } from './SerieCard';

export const SerieList = ({ navigation }) => {

    const limit = 20;
    const [offset, setOffset] = useState(0);
    const [movies, setMovies] = useState([]);
    const [showMore, setShowMore] = useState(true);

    const { country } = useContext(AuthContext);

    const manageCountries = async () => {
        const response = await getAllMovies('shows', limit, offset, country.toLowerCase());

        if (response.shows) {
            setMovies(prev => (
                [...prev, ...response.shows]
            ))
            setShowMore(true);
        }
    }

    useEffect(() => {
        manageCountries();
    }, [offset])

    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={styles.grid}>
                {
                    movies.length != 0 && movies.map(movie => (
                        <SerieCard key={movie.id} navigation={navigation} movie={movie} />
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
    }
})
