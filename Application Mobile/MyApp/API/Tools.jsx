import { useContext } from "react";
import { API_URL, APIKEY, GEO_API, GEO_KEY } from "./Setup"
import AuthContext from "../contexts/AuthContext";

export const authentication = (credentials) => {
    const options = {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: {
            "X-BetaSeries-Key": APIKEY,
            'Content-Type': 'application/json'
        },
    }
    return fetch(API_URL + "/members/auth", options).then(res => res.json());
}

export const getAllMovies = (type = "movies", limit = 20, offset = 0, localisation = "fr") => {

    const options = {
        method: "GET",
        headers: {
            "X-BetaSeries-Key": APIKEY,
            'Content-Type': 'application/json'
        },
    }

    try {
        return fetch(
            API_URL + `/${type}/list?start=${offset}&limit=${limit}&order=popularity&locale=${localisation}`,
            options).then(
                res => res.json()
            );
    } catch (exception) {
        return false;
    }
}

export const getMovieDetails = (id, token, localisation = 'fr') => {
    const options = {
        method: "GET",
        headers: {
            "X-BetaSeries-Key": APIKEY,
            'X-BetaSeries-Token': token,
            'Content-Type': 'application/json'
        },
    }
    try {
        return fetch(
            API_URL + `/movies/movie?id=${id}&locale=${localisation}`,
            options).then(
                res => res.json()
            );
    } catch (exception) {
        return false;
    }
}

export const getSerieDetails = (id, token, localisation = 'fr') => {
    const options = {
        method: "GET",
        headers: {
            "X-BetaSeries-Key": APIKEY,
            'X-BetaSeries-Token': token,
            'Content-Type': 'application/json'
        },
    }
    try {
        return fetch(
            API_URL + `/shows/display?id=${id}&locale=${localisation}`,
            options).then(
                res => res.json()
            );
    } catch (exception) {
        return false;
    }
}

export const manageFavorites = (type, id, token, method) => {
    const allowedMethods = [
        "POST",
        "DELETE"
    ]
    if (!allowedMethods.includes(method)) {
        return false;
    }
    const options = {
        method: method,
        headers: {
            "X-BetaSeries-Key": APIKEY,
            'X-BetaSeries-Token': token,
            'Content-Type': 'application/json'
        },
    }

    const suffix = type == "movies" ? "movie" : "show"

    return fetch(API_URL + `/${type}/${suffix}?id=${id}`, options).then(response => response.json());
}

export const getList = (type, token) => {
    const options = {
        method: 'GET',
        headers: {
            "X-BetaSeries-Key": APIKEY,
            'X-BetaSeries-Token': token,
            'Content-Type': 'application/json'
        },
    }

    return fetch(API_URL + `/${type}/member`, options).then(res => res.json())
}

export const getSearchResults = async (string, country = "fr") => {

    const options = {
        method: "GET",
        headers: {
            "X-BetaSeries-Key": APIKEY,
            'Content-Type': 'application/json'
        },
    }

    const movieUrl = API_URL + `/movies/search?title=${string}&order=popularity&locale=${country}`;
    const showUrl = API_URL + `/shows/search?title=${string}&order=popularity&locale=${country}`;

    const movies = await fetch(movieUrl, options).then(res => res.json());
    const shows = await fetch(showUrl, options).then(res => res.json());

    return {
        movies: movies,
        shows: shows
    }
}