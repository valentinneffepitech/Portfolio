import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import './Serie.css';

export default function Serie(props) {
    const nav = useNavigate();
    const { id } = useParams();
    const [serie, setSerie] = useState({});
    const [genres, setGenres] = useState([]);
    const [episodes, setEpisode] = useState([]);
    useEffect(() => {
        getData();
    }, [id, props.user]);
    useEffect(() => console.log(serie), [serie])
    useEffect(() => console.log(episodes), [episodes])
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const watched = (idEpisode, bulk = true) => {
        const indexToReplace = episodes.findIndex((item) => item.id === idEpisode);
        const episodeList = [...episodes];
        try {
            fetch(props.url + 'episode/seen', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: idEpisode,
                    bulk: bulk,
                    token: props.token
                })
            }).then(res => res.json()).then(data => {
                if (bulk) {
                    for (let i = 0; i < indexToReplace; i++) {
                        episodeList[i].user.seen = true;
                    }
                }
                episodeList[indexToReplace] = data.episode;
                setEpisode(episodeList);
                if (data.errors.length !== 0) {
                    alert(data.errors[0].text);
                }
            })
        } catch (err) {
            console.log(err)
        }
    }
    const unWatched = (idEpisode) => {
        const indexToReplace = episodes.findIndex((item) => item.id === idEpisode);
        const episodeList = [...episodes];
        try {
            fetch(props.url + 'episode/unSeen', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: idEpisode,
                    token: props.token
                })
            }).then(res => res.json()).then(data => {
                episodeList[indexToReplace] = data.episode;
                setEpisode(episodeList);
                if (data.errors.length !== 0) {
                    alert(data.errors[0].text);
                }
            })
        } catch (err) {
            console.log(err)
        }
    }
    const getEpisodes = (number) => {
        try {
            fetch(props.url + 'saison/' + number + "?token=" + props.token + "&id=" + id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json()).then(data => {
                console.log(data);
                setEpisode(data)
            })
        } catch (err) {
            console.log(err)
        }
    }
    const getData = () => {
        try {
            fetch(props.url + 'serie/' + id + "?token=" + props.token, options).then(res => res.json()).then(data => {
                setSerie(data.show);
                getEpisodes('1');
                setGenres([]);
                for (const [value] of Object.entries(data.show.genres)) {
                    setGenres(prev => [...prev, value]);
                }
            })
        } catch (err) {
            console.log(err);
        }
    }
    const modifyDate = (string) => {
        let date = new Date(string);
        return date.toLocaleDateString('en-GB');
    }
    const archive = () => {
        if (!props.user.id) {
            alert('Connectez-vous');
            return;
        }
        try {
            fetch(props.url + "archive", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: parseInt(id),
                    token: props.token
                })
            }).then(res => res.json()).then(data => setSerie(data.show));
        } catch (err) {
            console.log(err)
        }
    }
    const Unarchive = () => {
        try {
            fetch(props.url + "archive", {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: parseInt(id),
                    token: props.token
                })
            }).then(res => res.json()).then(data => setSerie(data.show))
        } catch (err) {
            console.log(err);
        }
    }
    const newShow = () => {
        try {
            fetch(props.url + "newShow", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: parseInt(id),
                    token: props.token
                })
            }).then(res => res.json()).then(data => setSerie(data.show))
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div className='container'>
            {serie.id &&
                <main>
                    <img className="poster" src={serie.images.poster} alt={serie.title} />
                    <article>
                        <h3 className='title'>{serie.title && serie.title}</h3>
                        <p id="description">{serie.description}</p>
                        <div id="genres">
                            {
                                genres.map(genre => (<div className='genre'>{genre}</div>))
                            }
                        </div>
                    </article>
                    <aside>
                        <ul>
                            <li><strong>Nombre de Saisons :</strong></li>
                            <li>{serie.seasons}</li>
                            <li><strong>Nombre d'Episodes :</strong></li>
                            <li>{serie.episodes}</li>
                            <li><strong>Durée Totale :</strong></li>
                            <li>{parseInt((parseInt(serie.length) * parseInt(serie.episodes)) / 60)} Heures et {(parseInt(serie.length) * parseInt(serie.episodes)) % 60} Minutes</li>
                            <li><strong>Noté</strong> {serie.notes.mean.toFixed(1)}/5 par {serie.notes.total} avis</li>
                            <li>Suivi par <strong></strong> {serie.followers} personnes</li>
                        </ul>
                        {serie.in_account ?
                            <div>
                                {!serie.user.archived ?
                                    <button onClick={() => {
                                        archive();
                                    }}>Archiver la série</button>
                                    :
                                    <button onClick={() => {
                                        Unarchive();
                                    }}>Désarchiver la série</button>
                                }
                            </div>
                            :
                            <div>
                                <button onClick={() => {
                                    newShow();
                                }}>Ajouter à ma liste</button>
                            </div>
                        }
                    </aside>
                </main>
            }
            {serie.seasons_details &&
                <div id="select_season" className='container'>
                    <select defaultValue={'1'} onChange={(e) => {
                        getEpisodes(e.target.value)
                    }}>
                        {serie.seasons_details.map(saison => {
                            return (
                                <option value={saison.number}>Saison {saison.number}</option>
                            )
                        })}
                    </select>
                </div>
            }
            {episodes.length !== 0 &&
                <div id="liste_episodes" className='container'>
                    <h2 className='text-2xl py-5'>Liste des épisodes</h2>
                    {episodes.map(episode => {
                        return (
                            <div className='episode'>
                                <div className='episode_body'>
                                    <img src={episode.image || props.defaultImage} alt={episode.title} />
                                    <div>
                                        <h2>{episode.title}</h2>
                                        <p>{episode.description}</p>
                                        <p>Episode sorti le
                                            {
                                                " " + modifyDate(episode.date)
                                            }
                                        </p>
                                        {episode.note &&
                                            <p>{episode.note.mean.toFixed(1)}/5 d'après {episode.note.total} utilisateurs</p>
                                        }
                                    </div>
                                </div>
                                {episode.user &&
                                    <div className='episode_buttons'>
                                        {
                                            !episode.user.seen ?
                                                <button className='unseen' onClick={() => watched(episode.id, false)}>Marquer comme vu</button>
                                                :
                                                <button className='seen' onClick={() => unWatched(episode.id)}>Marquer comme non-vu</button>
                                        }
                                        {
                                            !episode.user.seen &&
                                            <button className='unseen' onClick={() => watched(episode.id)}>Marquer comme vu ainsi que les précédents</button>
                                        }
                                        {props.user &&
                                            <button className='commentlink' onClick={() => nav('/episode/' + episode.id)}>Commenter</button>
                                        }
                                    </div>
                                }
                            </div>
                        )
                    })}
                </div>
            }
        </div >
    )
}
