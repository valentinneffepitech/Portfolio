import { useEffect, useState } from 'react'
import { X, Trash, MoveDown, MoveUp } from 'lucide-react';


const AdminPanel = () => {

  const searchInfos = {
    searchContent: '',
    order: 'id',
    orderDirection: "asc",
    limit: 5,
    page: 1
  };

  const [users, setUsers] = useState(null);
  const [totalUsers, setTotalUsers] = useState(null);
  const [detailedProfile, setDetailedProfile] = useState(null);
  const [search, setSearch] = useState(searchInfos);
  const [isLastPage, setIsLast] = useState(false);
  const [isFirstPage, setIsFirst] = useState(false);

  const getAllUsers = () => {
    fetch(
      'http://localhost:3001?action=getNumberUsers',
      {
        method: 'GET'
      }
    ).then(res => res.json()).then(data => setTotalUsers(data[0]['count']));
  }

  useEffect(() => {
    getAllUsers();
  }, [])

  useEffect(() => {
    fetch(`http://localhost:3001?action=search&search=${search.searchContent}&order=${search.order}&limit=${search.limit}&page=${search.page}&orderDirection=${search.orderDirection}`, {
      method: 'GET'
    }).then(res => res.json()).then(data => setUsers(data))
  }, [search])

  useEffect(() => {
    if (totalUsers && users) {
      const totalPages = Math.ceil(totalUsers / search.limit);
      console.log(totalPages)
      setIsFirst(search.page === 1 || totalPages === 1);
      setIsLast(search.page === totalPages);
    }
  }, [users])

  const deleteUser = (id) => {
    let data = new FormData();
    data.append('id', id);
    data.append('action', 'deleteUser')
    fetch('http://localhost:3001', {
      method: 'POST',
      body: data
    }).then(res => res.json()).then(data => {
      setDetailedProfile(null)
      setUsers(data)
      getAllUsers();
    })
  }

  return (
    <div>
      <input type="search" id="searchbar" onChange={(e) => {
        setSearch(prev => ({
          ...prev,
          searchContent: e.target.value
        }))
      }} placeholder="Search..." />
      <h2>Trier par :</h2>
      <div id="userSorter">
      <div>
        {
          search.orderDirection === 'asc' ?
            <MoveDown onClick={() => setSearch(prev => ({
              ...prev,
              orderDirection: 'desc'
            }))} />
            :
            <MoveUp onClick={() => setSearch(prev => ({
              ...prev,
              orderDirection: 'asc'
            }))} />
        }
      </div>
        <label htmlFor="id">
          <input id="id" defaultChecked type='radio' name="sortUser" value="id" onClick={(e) => setSearch(prev => ({
            ...prev,
            order: e.target.value
          }))} />
          ID
        </label>
        <label htmlFor='email'>
          <input id="email" type='radio' name="sortUser" value="email" onClick={(e) => setSearch(prev => ({
            ...prev,
            order: e.target.value
          }))} />
          Email
        </label>
        <label htmlFor='Nom'>
          <input id="Nom" type='radio' name="sortUser" value="Nom" onClick={(e) => setSearch(prev => ({
            ...prev,
            order: e.target.value
          }))} />
          Nom
        </label>
        <label htmlFor='Prenom'>
          <input id="Prenom" type='radio' name="sortUser" value="Prenom" onClick={(e) => setSearch(prev => ({
            ...prev,
            order: e.target.value
          }))} />
          Prenom
        </label>
        <label htmlFor='adress'>
          <input id="adress" type='radio' name="sortUser" value="adress" onClick={(e) => setSearch(prev => ({
            ...prev,
            order: e.target.value
          }))} />
          Adresse Postale
        </label>
        <label htmlFor='birthdate'>
          <input id="birthdate" type='radio' name="sortUser" value="birthdate" onClick={(e) => setSearch(prev => ({
            ...prev,
            order: e.target.value
          }))} />
          Date de Naissance
        </label>
        <label htmlFor='phone'>
          <input id="phone" type='radio' name="sortUser" value="phone" onClick={(e) => setSearch(prev => ({
            ...prev,
            order: e.target.value
          }))} />
          N° de tél
        </label>
        <label htmlFor='createdAt'>
          <input id="createdAt" type='radio' name="sortUser" value="created_at" onClick={(e) => setSearch(prev => ({
            ...prev,
            order: e.target.value
          }))} />
          Date de création
        </label>
      </div>
      <div id="limitPaginate">
        {
          totalUsers &&
          <input type='range' name="userLimit" min={1} max={totalUsers} defaultValue={search.limit} onChange={(e) => setSearch(prev => ({
            ...prev,
            limit: e.target.value
          }))} />
        }
        <div>
          Eléments à afficher : {search.limit}
        </div>
      </div>
      <div>
        {
          !isFirstPage &&
          <button
            className='btn btn-light'
            onClick={() => {
              setSearch(prev => ({
                ...prev,
                page: prev.page - 1
              }))
            }}>
            Précédent
          </button>
        }

        {
          !isLastPage &&
          <button
            className='btn btn-light'
            onClick={() => {
              setSearch(prev => ({
                ...prev,
                page: prev.page + 1
              }))
            }}>
            Suivant
          </button>
        }
      </div>
      <div id="userSummary" className='text-light'>
        <div>
          {
            users && users.map((user) => {
              return (
                <div className='userCard' key={user.id} onClick={() => setDetailedProfile(user)}>
                  <h2>{user.Nom.toUpperCase()} {user.Prenom.substring(0, 1).toUpperCase()}.</h2>
                  <p>ID:{user.id}</p>
                  <p><b>Email : </b>{user.email}</p>
                  <p>Inscrit depuis le : {new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              )
            })
          }
        </div>
        <div id="detailProfile" className={detailedProfile && "shown"}>
          {
            detailedProfile &&
            <div>
              <X id="closeTab" onClick={() => setDetailedProfile(null)} />
              {
                detailedProfile.photo ?
                  <img src={`http://localhost:3001${detailedProfile.photo}`} />
                  :
                  <p>Aucune photo Renseignée</p>
              }
              <div>
                <h2>{detailedProfile.Nom.toUpperCase()} {detailedProfile.Prenom.toUpperCase()}</h2>
                <p><b>ID</b>:<br />{detailedProfile.id}</p>
                <p><b>Adresse : </b><br />{detailedProfile.adress}</p>
                <p><b>Email : </b><br />{detailedProfile.email}</p>
                <p><b>Phone : </b><br />{detailedProfile.phone}</p>
                <p><b>Date de Naissance:</b><br />
                  {new Date(detailedProfile.birthdate).toLocaleDateString()}
                </p>
                <p><b>Inscrit depuis le : </b><br />{new Date(detailedProfile.created_at).toLocaleDateString()}</p>
                <Trash color='red' id="trashCan" size={"50"} onClick={() => {
                  let confirmation = confirm('You sure, you wanna destroy him?');
                  if (confirmation) {
                    deleteUser(detailedProfile.id)
                  }
                }} />
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
