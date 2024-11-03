import React, { useEffect, useRef, useState } from 'react'
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getSearchResults } from '../API/Tools';
import { Loader } from './components/Loader';

export const Search = ({ navigation }) => {

    const [search, setSearch] = useState(false);
    const [shouldSearch, setShouldSearch] = useState(false);
    const [searching, setIsSearching] = useState(false);
    const [results, setResults] = useState(false);

    const searchbar = useRef(null);

    useEffect(() => {
        let timer;
        if (search) {
            if (search.length === 0) {
                setResults(false);
                setSearch(false);
                setIsSearching(false);
                return;
            }
            setIsSearching(true);
            if (search.length > 0) {
                timer = setTimeout(() => {
                    setShouldSearch(true);
                }, 2000);
            }
        }
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        if (shouldSearch) {
            searchForResults(search);
            setShouldSearch(false);
        }
    }, [shouldSearch, search]);

    async function searchForResults(string) {
        const response = await getSearchResults(string);
        setResults(response);
        setIsSearching(false);
    }

    useEffect(() => {
        searchbar.current.focus();
    }, [])

    return (
        <SafeAreaView>
            <View
                style={{
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'center',
                    justifyContent: "space-around",
                    padding: 10,
                    backgroundColor: '#fff',
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOpacity: 0.2,
                    shadowRadius: 5,
                    shadowOffset: { width: 0, height: 2 },
                }}
            >
                <TextInput
                    placeholder="Rechercher"
                    style={{
                        height: 40,
                        borderColor: 'gray',
                        borderWidth: 1,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 10,
                        width: '80%',
                    }}
                    ref={searchbar}
                    onChangeText={(text) => setSearch(text)}
                />
                <Ionicons name="close-circle-outline" size={25} color="#333" onPress={() => searchbar.current.value = ""} />
            </View>
            <ScrollView
                contentContainerStyle={{
                    padding: 20,
                    backgroundColor: '#fff',
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOpacity: 0.2,
                    shadowRadius: 5,
                    shadowOffset: { width: 0, height: 2 },
                    paddingBottom: 20
                }}
            >
                {
                    searching && <Loader />
                }
                {
                    results ?
                        <View>
                            {
                                results &&
                                <View>
                                    {
                                        (results.shows.shows.length == 0 && results.movies.movies.length == 0) &&
                                        <Text>
                                            Aucun résultat... Essayez autre chose !
                                        </Text>
                                    }
                                    {
                                        results.shows.shows &&
                                        <View>
                                            {
                                                results.shows.shows.map((item) => {
                                                    const config = {
                                                        screen: "serieDetails",
                                                        params: {
                                                            id: item.id,
                                                        }
                                                    }
                                                    return (
                                                        <Pressable
                                                            key={item.id}
                                                            style={
                                                                {
                                                                    width: '100%',
                                                                    backgroundColor: '#fff',
                                                                    flexDirection: 'row',
                                                                    justifyContent: 'start',
                                                                    gap: 20,
                                                                    alignItems: 'center',
                                                                    height: 100,
                                                                }
                                                            }
                                                            onPress={
                                                                () => { navigation.navigate('Series', config) }
                                                            }
                                                        >
                                                            <Image source={
                                                                item.images.poster ?
                                                                    {
                                                                        uri: item.images.poster
                                                                    } :
                                                                    require('./components/assets/404.jpg')
                                                            }
                                                                style={{
                                                                    width: 45,
                                                                    height: 60,
                                                                    borderRadius: 10,
                                                                }}
                                                            />
                                                            <Text>
                                                                {item.title}
                                                            </Text>
                                                        </Pressable>
                                                    )
                                                })}
                                        </View>
                                    }
                                    {
                                        results.movies.movies &&
                                        <View>
                                            {
                                                results.movies.movies.map((item) => {
                                                    const config = {
                                                        screen: "movieDetails",
                                                        params: {
                                                            id: item.id,
                                                        }
                                                    }
                                                    return (
                                                        <Pressable
                                                            key={item.id}
                                                            style={
                                                                {
                                                                    width: '100%',
                                                                    height: 100,
                                                                    backgroundColor: '#fff',
                                                                    flexDirection: 'row',
                                                                    justifyContent: 'start',
                                                                    gap: 20,
                                                                    alignItems: 'center',
                                                                }
                                                            }
                                                            onPress={
                                                                () => {
                                                                    navigation.navigate('Films', config)
                                                                }
                                                            }
                                                        >
                                                            <Image source={
                                                                item.poster ?
                                                                    {
                                                                        uri: item.poster
                                                                    } :
                                                                    require('./components/assets/404.jpg')
                                                            }
                                                                style={{
                                                                    width: 45,
                                                                    height: 60,
                                                                    borderRadius: 10,
                                                                }}
                                                            />
                                                            <Text>
                                                                {item.title}
                                                            </Text>
                                                        </Pressable>
                                                    )
                                                })}
                                        </View>
                                    }
                                </View>
                            }</View> :
                        <Text>Vos résultats de recherche s'afficheront ici</Text>
                }
            </ScrollView>
        </SafeAreaView>
    )
}
