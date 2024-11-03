import React, { useContext, useEffect, useState } from 'react'
import { Image, Linking, Platform, Pressable, SafeAreaView, ScrollView, Share, StyleSheet, Text, View } from 'react-native'
import { getMovieDetails, manageFavorites } from '../../../API/Tools';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AuthContext from '../../../contexts/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Calendar from "expo-calendar"
import { Gyroimage } from '../gyroscope/Gyroimage';

export const MovieDetails = ({ route, navigation }) => {

    const defaultParam = route.params ? route.params : false;

    const { country, user, refresh } = useContext(AuthContext);

    const time = Date.now();

    const [showPicker, setShowPicker] = useState(false);
    const [reminder, setReminder] = useState(time);
    const [detail, setDetail] = useState(false);

    const openRequest = async () => {
        const calendartStatus = await Calendar.requestCalendarPermissionsAsync()
    }

    const share = async () => {
        try {
            await Share.share({
                message: `Je te conseille de regarder ce super film : ${countryTitle() ? countryTitle() : detail.title}`
            })
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        openRequest()
    }, [])

    const eventDetails = () => {
        return {
            title: `Regarder ${countryTitle() ? countryTitle() : detail.title}`,
            startDate: new Date(reminder),
            endDate: new Date(reminder + 60 * 60),
            location: "Maison",
            notes: `Regarder ${countryTitle() ? countryTitle() : detail.title}`,
            timeZone: "Europe/Paris",
        }
    }

    const addEventToCalendar = async (eventDetails) => {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const calendarId = calendars.filter(calendar => calendar.allowsModifications)[0].id;
        const eventIdInCalendar = await Calendar.createEventAsync(calendarId, eventDetails)
        Calendar.openEventInCalendar(eventIdInCalendar)
    }

    const getDetails = async (id) => {
        const response = await getMovieDetails(id, user.token ? user.token : "", country.toLowerCase());
        if (response) {
            setDetail(response.movie);
        }
    }

    const countryTitle = () => {
        const other_titles = detail.other_title;
        if (!other_titles) {
            return false;
        }
        if (other_titles.language == country.toLowerCase()) {
            return other_titles.title;
        } else {
            return false;
        }
    }

    const timeDisplay = (time) => {
        let minutes = Math.floor(time / 60);
        const hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        let returnValue;
        if (hours > 0) {
            returnValue = `${hours}h${minutes}`
        } else if (minutes > 0) {
            returnValue = `${minutes} minutes`
        }
        return returnValue;
    }

    const favorite = async (method) => {
        if (!user) {
            return false;
        }
        const response = await manageFavorites("movies", detail.id, user.token, method);
        if (response.movie) {
            setDetail(response.movie)
            if (method == "DELETE") {
                setDetail(prev => ({
                    ...prev,
                    user: {
                        ...prev.user,
                        in_account: !prev.user.in_account
                    }
                }))
            }
            refresh();
        }
    }

    useEffect(() => {
        if (defaultParam) {
            getDetails(defaultParam.id);
        }
    }, [defaultParam])

    return (
        <SafeAreaView>
            <Ionicons
                name={"arrow-back-outline"}
                size={30}
                color={"#1d1d1d"}
                style={{
                    marginHorizontal: "3%",
                    marginVertical: 10
                }}
                onPress={() => navigation.navigate('Films', {
                    screen: "All"
                })}
            />
            {
                detail && (
                    <ScrollView
                        contentContainerStyle={{
                            paddingBottom: 100
                        }}
                    >
                        <Text style={{
                            fontSize: 24,
                            fontWeight: "bold",
                            marginVertical: 10,
                            marginHorizontal: "auto",
                            width: "80%",
                            textAlign: "center"
                        }}>{countryTitle() ? countryTitle() : detail.title}</Text>
                        <View style={styles.container}>
                            <Gyroimage path={detail.poster} />
                            <View style={styles.details}>
                                <Text style={styles.infos}><Text style={styles.categories}>Durée:</Text></Text>
                                <Text style={styles.infos}>{timeDisplay(detail.length)}</Text>
                                <Text style={styles.infos}><Text style={styles.categories}>Genres:</Text></Text>
                                {
                                    detail.genres.map((genre, index) => (
                                        <Pressable key={index} style={styles.genre}>
                                            <Ionicons
                                                name={"remove-outline"}
                                                size={20}
                                                color={"#1d1d1d"}
                                                style={{
                                                    margin: 5
                                                }}
                                            />
                                            <Text style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "center"
                                            }}>
                                                {genre}
                                            </Text>
                                        </Pressable>
                                    ))
                                }
                            </View>
                        </View>
                        <Text style={styles.infos}><Text style={styles.categories}>Synopsis:</Text></Text>
                        <Text style={styles.infos}>{detail.synopsis}</Text>
                        {
                            detail.platforms_svod.length != 0 &&
                            <View style={styles.platforms}>
                                <Text style={styles.infos}><Text style={styles.categories}>Plateformes:</Text></Text>
                                <ScrollView horizontal style={{
                                    width: "90%",
                                    marginHorizontal: "5%",
                                }}>
                                    {
                                        detail.platforms_svod.map((platform, index) => {
                                            return (
                                                <Pressable key={index} style={styles.platform} onPress={
                                                    () => Linking.openURL(platform.link_url)}>
                                                    <Image
                                                        source={
                                                            platform.logo ? { uri: platform.logo } : require('../assets/404.jpg')
                                                        }
                                                        style={styles.logo}
                                                    />
                                                </Pressable>
                                            )
                                        })
                                    }
                                </ScrollView>
                            </View>
                        }
                        <View style={styles.userArea}>
                            {
                                (user && detail.user) &&
                                <>
                                    {
                                        detail.user.in_account ?
                                            <Pressable
                                                style={styles.button("#FF9A9A", "red")}
                                                onPress={() => favorite('DELETE')}
                                            >
                                                <Ionicons name="heart" size={24} color="red" />
                                                <Text style={styles.buttonText("red")}>
                                                    Retirer des favoris
                                                </Text>
                                            </Pressable>
                                            :
                                            <Pressable
                                                style={styles.button("#5FBB97", "green")}
                                                onPress={() => favorite('POST')}
                                            >
                                                <Ionicons name="heart-outline" size={24} color="white" />
                                                <Text style={styles.buttonText("white")}>
                                                    Ajouter aux favoris
                                                </Text>
                                            </Pressable>
                                    }
                                </>
                            }
                            <Pressable
                                style={styles.button()}
                                onPress={() => share()}
                            >
                                <Ionicons name="share-social-outline" size={24} color="white" />
                                <Text style={styles.buttonText("white")}>
                                    Partager
                                </Text>
                            </Pressable>
                            {
                                Platform.OS !== "ios" &&
                                <View style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center"
                                }}>
                                    {
                                        showPicker ?
                                            <>
                                                <DateTimePicker mode="datetime"
                                                    display="default" value={new Date(reminder)} onChange={(e) => {
                                                        setReminder(e.nativeEvent.timestamp);
                                                    }} />
                                                <Pressable style={styles.button("#474747", "#000")}
                                                    onPress={() => {
                                                        setShowPicker(false);
                                                        addEventToCalendar(eventDetails())
                                                    }}>
                                                    <Ionicons name="calendar-outline" size={24} color="#fff" />
                                                    <Text style={styles.buttonText("#f6f6f6")}>
                                                        Confirmer le rappel
                                                    </Text>
                                                </Pressable>
                                            </>
                                            :
                                            <Pressable
                                                onPress={() => setShowPicker(true)}
                                                style={styles.button()}
                                            >
                                                <Ionicons name="calendar-outline" size={24} color="white" />
                                                <Text
                                                    style={styles.buttonText("white")}
                                                >
                                                    Ajouter un rappel
                                                </Text>
                                            </Pressable>
                                    }
                                </View>
                            }
                        </View>
                    </ScrollView>
                )
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
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
    },
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    details: {
        width: "50%",
        marginHorizontal: 20,
        marginVertical: 40
    },
    categories: {
        color: "#1d1d1d",
        fontWeight: "800",
        textDecorationStyle: "solid",
        textDecorationColor: "#1d1d1d",
        textDecorationLine: "underline",
    },
    infos: {
        color: "#1d1d1d",
        marginVertical: 5,
        width: "90%",
        marginHorizontal: "5%"
    },
    genre: {
        display: "flex",
        flexDirection: "row",
        alignitems: 'center'
    },
    logo: {
        width: 100,
        height: 100,
        marginHorizontal: 10,
    },
    button: function (bgColor = "#474747", borderColor = "#1d1d1d", width = "auto") {
        return {
            borderRadius: 10,
            borderColor: borderColor,
            backgroundColor: bgColor,
            borderWidth: 2,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 30,
            paddingVertical: 10,
            marginHorizontal: "auto",
            marginTop: 20,
            width: width,
            gap: 10
        }
    },
    buttonText: function (color = "#1d1d1d") {
        return {
            color: color,
            fontWeight: "bold",
            fontSize: 15
        }
    }
})