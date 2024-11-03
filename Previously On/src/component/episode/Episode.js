import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import './Episode.css';

export default function Episode(props) {
    const { id } = useParams();
    const [episode, setEpisode] = useState({});
    const [comments, setComments] = useState([]);
    const [commentaire, setCommentaire] = useState('');
    useEffect(() => {
        getData();
    }, [id, props.user]);
    useEffect(() => console.log(comments), [comments])
    const getData = () => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        try {
            fetch(props.url + 'episode/' + id + "?token=" + props.token, options).then(res => res.json()).then(data => {
                setEpisode(data.episode);
            })
        } catch (err) {
            console.log(err);
        }
        try {
            fetch(props.url + 'comments/' + id + "?token=" + props.token, options).then(res => res.json()).then(data => {
                setComments(data);
            })
        } catch (err) {
            console.log(err);
        }
    }
    const modifyDate = (string) => {
        let date = new Date(string);
        return date.toLocaleDateString('en-GB');
    }
    const handleSubmit = () => {
        console.log(commentaire);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: commentaire,
                id: id,
                token: props.token,
                type: "episode"
            })
        }
        try {
            fetch(props.url + 'comments/' + id + "?token=" + props.token, options).then(res => res.json()).then(data => {
                setComments(prev => [...prev, data.comment]);
            })
            return true;
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div className='container'>
            {episode.id &&
                <main id="main_episode">
                    <h3 className="title">{episode.title}</h3>
                    <div id="episode_body">
                        <img alt={episode.title} src={episode.image} />
                        <div>
                            <p>{episode.description}</p>
                        </div>
                        <div>
                            <p>Episode sorti le
                                {
                                    " " + modifyDate(episode.date)
                                }
                            </p>
                            {episode.note &&
                                <p>Noté {episode.note.mean.toFixed(1)}/5 d'après {episode.note.total} utilisateurs</p>
                            }
                        </div>
                    </div>
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        if (handleSubmit()) {
                            document.querySelector('#comment_area').value = "";
                        } else {
                            alert('Something went wrong sorry Boss...')
                        }
                    }}>
                        <textarea id="comment_area" placeholder='Votre commentaire' onChange={(ev) => {
                            setCommentaire(ev.target.value)
                        }}></textarea>
                        <button>Commenter</button>
                    </form>
                </main>
            }
            <h3 className="title">Commentaires des Viewers</h3>
            {comments.length !== 0 &&
                <section>
                    {comments.map(com => (
                        <div key={com.id} className="commentaire">
                            <p>
                                {com.text}
                            </p>
                        </div>
                    ))}
                </section>
            }
        </div >
    )
}
