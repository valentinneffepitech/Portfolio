import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home(props) {
    const navigate = useNavigate();
    const [isSearching, setIsSearching] = useState(false);
    const [films, setFilms] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() =>
        shows(),
        [props.user],)

    useEffect(() =>
        console.log(searchResults), [searchResults]
    )
    const searchbar = async (search) => {
        if (search.length === 0) {
            console.log('echo bite')
            setIsSearching(false);
            setSearchResults([]);
            return;
        } else {
            setIsSearching(true);
            await fetch(props.url + 'searchbar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    search: search,
                    token: props.token
                })
            }).then(res => res.json()).then(data => setSearchResults(data.shows));
        }
    }
    const newShow = (id) => {
        const indexToReplace = films.findIndex((item) => item.id === id);
        const newlist = [...films];
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
            }).then(res => res.json()).then(data => {
                newlist[indexToReplace] = data.show;
                setFilms(newlist);
            })
        } catch (err) {
            console.log(err);
        }
    }

    function shows() {
        const options = {
            method: "GET",
            headers: {
                "content-type": "application/json"
            }
        }
        try {
            fetch(props.url + "home?token=" + props.token, options).then(res => res.json()).then(data => setFilms(data));
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <>
            <div className="pt-4 title">
                <h1>Les series disponibles</h1>
            </div>
            <div id="searchzone">
                <input type="text" placeholder="Search" id="searchbar" onChange={(ev) => {
                    searchbar(ev.target.value);
                }} />
                {
                    (searchResults.length !== 0 && isSearching) &&
                    <div id="searchResults">
                        {searchResults.map(serie => {
                            return (<div className="searchResults" key={serie.id} onClick={() => navigate("/serie/" + serie.id)}>{serie.title}</div>)
                        })}
                    </div>
                }
            </div>
            {films.length !== 0 && (
                <div className="list_films">
                    {films.slice(0, 100).map((film, index) => (
                        <div className="affiche" key={index}>
                            {film.images ?
                                <img src={film.images.poster || props.defaultImage} alt={film.title} loading="lazy" onClick={() => navigate('/serie/' + film.id)} />
                                :
                                <img src={props.defaultImage} alt={film.title} loading="lazy" onClick={() => navigate('/serie/' + film.id)} />
                            }
                            <h3 className="text-3xl">{film.title}
                                {!film.in_account &&
                                    <img className="icone" alt="add" src={process.env.PUBLIC_URL + "ajouter_white.png"} onClick={() => {
                                        newShow(film.id)
                                    }} />
                                }
                            </h3>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}


export default Home;
