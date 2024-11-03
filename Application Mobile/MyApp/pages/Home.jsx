import React, { useContext, useEffect, useState } from 'react'
import { API_URL, APIKEY, GEO_API, GEO_KEY } from "../API/Setup"
import { Text, StyleSheet, ScrollView as Scrollable, View } from 'react-native';
import AuthContext from '../contexts/AuthContext';
import { Header } from './components/Header';
import { SerieCard } from './components/Series/SerieCard';
import { MovieCard } from './components/Movie/MovieCard';
import { Search } from './Search';

import * as Location from 'expo-location';

export const Home = ({ navigation }) => {

  const [movies, setMovies] = useState(false);
  const [randomMovies, setRandomMovies] = useState(false);

  const { localise, country } = useContext(AuthContext);

  const getCountry = async (coords) => {
    let Url = GEO_API;

    const lat = "lat=" + coords.latitude
    const lon = "lon=" + coords.longitude

    const options = {
      method: "GET",
      headers: {
        "X-Api-Key": GEO_KEY,
        'Content-Type': 'application/json'
      },
    }

    const response = await fetch(
      Url + lat + "&" + lon,
      options
    ).then(res => res.json());

    return response[0] ? response[0].country : false;
  }

  const geoLocalize = async () => {
    const loc = await Location.requestForegroundPermissionsAsync();
    if (loc.status !== "granted") {
      return false;
    }
    const coords = await Location.getCurrentPositionAsync({});
    const country = await getCountry(coords.coords)
    if (country.country) {
      localise(country.country)
    }
  }

  const getRandom = async (limit) => {
    let randomShowUrl = API_URL + '/shows/random?locale=' + country + '&nb=' + limit;
    let randomMovieUrl = API_URL + '/movies/random?locale=' + country + '&nb=' + limit;
    const options = {
      method: "GET",
      headers: {
        "X-BetaSeries-Key": APIKEY,
        'Content-Type': 'application/json'
      },
    }
    const shows = await fetch(
      randomShowUrl,
      options
    ).then(res => res.json());
    const movies = await fetch(
      randomMovieUrl,
      options
    ).then(res => res.json());
    setRandomMovies({ shows: shows.shows, films: movies.movies });
  }

  const getPopulars = async (limit) => {
    const showUrl = API_URL + "/shows/list?locale=" + country + "&order=popularity&limit=" + limit
    const movieUrl = API_URL + "/movies/list?locale=" + country + "&order=popularity&limit=" + limit
    const options = {
      method: "GET",
      headers: {
        "X-BetaSeries-Key": APIKEY,
        'Content-Type': 'application/json'
      },
    }
    const shows = await fetch(
      showUrl,
      options
    ).then(res => res.json());
    const movies = await fetch(
      movieUrl,
      options
    ).then(res => res.json());
    setMovies({ shows: shows.shows, films: movies.movies });
  }

  useEffect(() => {
    getPopulars(25);
    getRandom(10);
    geoLocalize();
  }, [])

  return (
    <View>
      <Header navigation={navigation} />
      <Scrollable contentContainerStyle={{
        paddingBottom: 100,
      }}>
        <View>
          <Text style={styles.title}>
            Les séries les plus populaires
          </Text>
        </View>
        <Scrollable horizontal>
          <Text>
          </Text>
          {
            movies && movies.shows.map(movie => (
              <SerieCard navigation={navigation} movie={movie} />
            ))
          }
        </Scrollable>
        <View>
          <Text style={styles.title}>
            Les films les plus populaires
          </Text>
        </View>
        <Scrollable horizontal>
          {
            movies && movies.films.map(movie => (
              <MovieCard navigation={navigation} movie={movie} />
            ))
          }
        </Scrollable>
        <View>
          <Text style={styles.title}>
            Suggestions de Séries
          </Text>
        </View>
        <Scrollable horizontal>
          <Text>
          </Text>
          {
            randomMovies && randomMovies.shows.map(movie => {
              if (movie.images.poster) {
                return (
                  <SerieCard key={movie.id + "show"} navigation={navigation} movie={movie} />)
              }
            }
            )
          }
        </Scrollable>
        <View>
          <Text style={styles.title}>
            Suggestions de Films
          </Text>
        </View>
        <Scrollable horizontal>
          {
            randomMovies && randomMovies.films.map(movie => {
              if (movie.poster) {
                return (
                  <MovieCard key={movie.id + "movie"} navigation={navigation} movie={movie} />
                )
              }
            })
          }
        </Scrollable>
      </Scrollable>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#1d1d1d",
    height: 100,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingLeft: "5%",
    paddingBottom: "5%",
  },
  text: {
    color: "#f6f6f6",
    fontSize: 25,
  },
  title: {
    color: "#252525",
    fontSize: 25,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10
  },
  showMore: {
    textAlign: "right",
    marginRight: "5%",
    marginBottom: 10,
    marginTop: 5,
    fontSize: 15,
    fontWeight: "500",
    color: "#252525",
    fontStyle: "italic",
  }
})