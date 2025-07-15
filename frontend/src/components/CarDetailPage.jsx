import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function CarDetailPage() {
  const { id } = useParams(); // prendo l'id dell'auto dalla URL
  const navigate = useNavigate(); // per cambiare pagina
  const [car, setCar] = useState(null); // qui salvo i dati dell'auto
  const [loading, setLoading] = useState(true); // se sto caricando i dati

  useEffect(() => {
    // prendo i dati dell'auto dal server usando l'id
    fetch(`http://localhost:3001/cars/${id}`)
      .then(res => res.json())
      .then(data => {
        setCar(data.car); // salvo i dati
        setLoading(false); // ho finito di caricare
      })
      .catch(err => {
        console.error("Fetch error:", err); // se c'è errore lo mostro
        setLoading(false); // smetto di caricare anche se errore
      });
  }, [id]);

  // aggiungo l'auto ai preferiti nel localStorage
  const aggiungiAiPreferiti = () => {
    const preferiti = JSON.parse(localStorage.getItem("preferiti")) || []; // prendo preferiti da storage o lista vuota
    const esisteGia = preferiti.some(p => p.id === car.id); // controllo se auto è già nei preferiti

    if (esisteGia) {
      alert("Questa auto è già nei preferiti!"); // messaggio se già c'è
    } else {
      preferiti.push(car); // aggiungo auto ai preferiti
      localStorage.setItem("preferiti", JSON.stringify(preferiti)); // salvo nel localStorage
    }

    navigate("/preferiti"); // vado alla pagina preferiti
  };

  // torno indietro alla pagina precedente
  const tornaIndietro = () => {
    navigate(-1);
  };

  if (loading) return <p>Caricamento...</p>; // mostra messaggio mentre carico
  if (!car) return <p>Auto non trovata.</p>; // messaggio se non trovo l'auto

  return (
    <div className="container-single">
      <h1 className="title">{car.title}</h1> {/* titolo auto */}
      <img src={car.image} alt={car.title} className="image" /> {/* immagine auto */}
      <div className="detailsGrid">
        <div><strong>Brand:</strong> {car.brand}</div>
        <div><strong>Model:</strong> {car.model}</div>
        <div><strong>Year:</strong> {car.year}</div>
        <div><strong>Price:</strong> €{car.price}</div>
        <div><strong>Fuel Type:</strong> {car.fuelType}</div>
        <div><strong>Kilometers:</strong> {car.km} km</div>
        <div><strong>Plate:</strong> {car.plate}</div>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {/* bottone per aggiungere ai preferiti */}
        <button
          onClick={aggiungiAiPreferiti}
          style={{
            backgroundColor: 'lightgreen',
            padding: '8px 12px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          Aggiungi ai preferiti
        </button>

        {/* bottone per tornare indietro */}
        <button
          onClick={tornaIndietro}
          style={{
            backgroundColor: 'lightcoral',
            padding: '8px 12px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          Torna indietro
        </button>
      </div>
    </div>
  );
}
