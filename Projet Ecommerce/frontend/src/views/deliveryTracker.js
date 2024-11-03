import React, { useState } from 'react';
import axios from 'axios';
import 'animate.css';
import toastr from 'toastr';
import 'toastr/build/toastr.css';

toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-bottom-full-width",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

const DeliveryTracker = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deliveries, setDeliveries] = useState([]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  function transformStatus(string) {
    switch (string) {
      case 'completed':
        return 'En cours de traitement';
      case 'in-progress':
        return 'En préparation'
      case 'pending':
        return 'En cours de livraison'
      default:
        return 'Livrée'
    }
  }

  const fetchDeliveries = () => {
    axios.get(`http://localhost:8000/api/deliverytracker/${searchTerm}`)
      .then(response => {
        if (response.data.length === 0) {
          toastr.error('Aucune commande trouvé');
          return;
        }
        setDeliveries(response.data);
      })
      .catch(error => console.error('Error fetching deliveries:', error));
  };

  const buttonAnimation = () => {
    const button = document.querySelector(".animate__animated");
    button.classList.add("animate__fadeOut");

    setTimeout(() => {
      button.classList.remove("animate__fadeOut");
    }, 200);
  };

  return (
    <div id='delivery_track'>
      <h1 id="title_delivery_track">Suivi de livraison</h1>
      <div className="flex justify-center">
        <input
          className="border border-gray-300 rounded-md px-4 py-2 mr-4"
          type="number"
          min={0}
          placeholder="Votre N° de commande"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded animate__animated animate__faster"
          onClick={() => {
            fetchDeliveries();
            buttonAnimation();
          }}>Rechercher</button>
      </div>
      {deliveries.length > 0 && (
        <table>
          <thead className="head_dashboard">
            <tr>
              <th>Numéro</th>
              <th>Adresse de livraison</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody className='body_dashboard'>
            {deliveries.map(delivery => (
              <tr key={delivery.id}>
                <td>{delivery.numero}</td>
                <td>{delivery.name}<br />{delivery.address}<br />{delivery.zipcode} {delivery.city}</td>
                <td>{transformStatus(delivery.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DeliveryTracker;
