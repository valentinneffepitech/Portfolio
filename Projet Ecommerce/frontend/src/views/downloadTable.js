import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DownloadTable(props) {
  const navigation = useNavigate();
  const [selectedTable, setSelectedTable] = useState('');

  function handleTableSelect(event) {
    setSelectedTable(event.target.value);
  }

  function handleDownload() {
    axios({
      method: 'post',
      url: `http://localhost:8000/api/downloadTable/${selectedTable}`,
      responseType: 'blob',
    })
      .then(response => {
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedTable}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error(error);
      });
  }

  useEffect(() => {
    if (!props.auth.isAdmin) {
      navigation('/')
    }
  }, []);

  return (
    <div id="DL_Table">
      <h1 className='title_dashboard'>Télécharger une table</h1>
      <form id="form_dl_table" onSubmit={(e) => {
        e.preventDefault()
      }}>
        <select id="select_table" value={selectedTable} onChange={handleTableSelect}>
          <option value="">Sélectionnez une table</option>
          <option value="users">Utilisateurs</option>
          <option value="items">Articles</option>
          <option value="deliveries">Commandes</option>
          <option value="cards">Cartes Renseignées</option>

        </select>
        <div id="dl_btn_div">
          <button id="dl_btn" onClick={handleDownload} disabled={!selectedTable}>
            Télécharger
          </button>
        </div>
      </form>
    </div>
  );
}

export default DownloadTable;
