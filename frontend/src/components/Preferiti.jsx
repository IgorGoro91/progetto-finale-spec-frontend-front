import React, { useEffect, useState } from "react"; 
import { useNavigate } from "react-router-dom"; 

// Componente Preferiti
const Preferiti = () => {
  const [preferiti, setPreferiti] = useState([]); // Stato per salvare le auto preferite
  const navigate = useNavigate(); // Hook per navigare tra le pagine

  // Quando il componente si carica, prende i preferiti dal localStorage
  useEffect(() => {
    const salvati = JSON.parse(localStorage.getItem("preferiti")) || []; // Prende l'elenco o array vuoto
    setPreferiti(salvati); // Lo salva nello stato
  }, []); // Solo al primo caricamento

  // Funzione per rimuovere un'auto dai preferiti
  const eliminaPreferito = (id) => {
    const nuoviPreferiti = preferiti.filter((auto) => auto.id !== id); // Rimuove l'auto con quell'id
    localStorage.setItem("preferiti", JSON.stringify(nuoviPreferiti)); // Aggiorna il localStorage
    setPreferiti(nuoviPreferiti); // Aggiorna lo stato
  };

  // Se non ci sono preferiti salvati
  if (preferiti.length === 0) {
    return <p style={{ padding: "20px" }}>Nessuna auto nei preferiti...</p>;
  }

  return (
    <div
      className="container"
      style={{ display: "flex", flexWrap: "wrap", gap: "16px", padding: "20px" }}
    >
      {/* Mostra ogni auto salvata nei preferiti */}
      {preferiti.map((auto) => (
        <div
          key={auto.id} 
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            width: "300px",
            textAlign: "center",
            cursor: "pointer"
          }}
        >
          {/* Immagine dell’auto, cliccabile per andare al dettaglio */}
          <img
            src={auto.image}
            alt={auto.title}
            style={{
              width: "100%",
              height: "120px",
              objectFit: "cover",
              borderRadius: "4px"
            }}
            onClick={() => navigate(`/cars/${auto.id}`)} // Va alla pagina dettaglio auto
          />
          {/* Titolo cliccabile */}
          <h3 onClick={() => navigate(`/cars/${auto.id}`)}>{auto.title}</h3>
          <p>{auto.category}</p>
          {/* Bottone per rimuovere dai preferiti */}
          <button
            onClick={() => eliminaPreferito(auto.id)}
            style={{
              marginTop: "10px",
              padding: "8px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "#dc3545",
              color: "white",
              cursor: "pointer",
            }}
          >
            Rimuovi
          </button>
        </div>
      ))}
    </div>
  );
};

export default Preferiti; 
