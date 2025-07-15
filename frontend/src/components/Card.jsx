import React from "react";

// Questo è un componente chiamato Card, usato per mostrare le informazioni di un'auto
export default function Card({
  
  id,
  image,         
  title,         
  category,     
  brand,        
  model,         
  year,          
  price,         
  fuelType,      
  km,            
  plate,         // targa
  isSelected,    // true/false: se l'auto è selezionata per il confronto
  onToggle,      // funzione per selezionare/deselezionare l'auto
  isFavorite,    // true/false: se l'auto è nei preferiti
  onToggleFavorite, // funzione per aggiungere o togliere dai preferiti
  showToggleButton,   // true/false: se mostrare il bottone "Seleziona"
  showFavoriteHeart,  // true/false: se mostrare il cuore dei preferiti
}) {
  
  return (
    <div className={`card ${isSelected ? "selected" : ""}`}> {/* aggiunge classe 'selected' se l'auto è selezionata */}
      
      {/* Immagine dell'auto */}
      <div className="card-image-wrapper">
        <img src={image} alt={title} className="card-image" />
      </div>

      <div className="card-content">
        {/* Titolo dell'auto */}
        <h3 className="card-title">{title}</h3>

        {/* Dettagli dell'auto */}
        <div className="card-details">
          <p><strong>Categoria:</strong> {category}</p>
          <p><strong>Marca:</strong> {brand}</p>
          <p><strong>Modello:</strong> {model}</p>
          <p><strong>Anno:</strong> {year}</p>
          <p><strong>Prezzo:</strong> €{price.toLocaleString()}</p>
          <p><strong>Carburante:</strong> {fuelType}</p>
          <p><strong>Chilometri:</strong> {km.toLocaleString()} km</p>
          <p><strong>Targa:</strong> {plate}</p>
        </div>

        {/* Bottone per selezionare/deselezionare l'auto per il confronto */}
        {showToggleButton && (
          <button
            onClick={onToggle} // chiama la funzione al click
            style={{
              marginTop: "10px",
              padding: "8px 16px",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
              color: "white",
              backgroundColor: isSelected ? "#dc3545" : "#007bff" // cambia colore se selezionato
            }}
          >
            {isSelected ? "Deseleziona" : "Seleziona"}
          </button>
        )}

        {/* Icona cuore per aggiungere o togliere l’auto dai preferiti */}
        {showFavoriteHeart && (
          <div className="card-actions" style={{ marginTop: "40px" }}>
            <span
              onClick={onToggleFavorite} // al clic cambia se è nei preferiti o no
              className={`favorite-heart ${isFavorite ? "favorite" : ""}`} // cambia colore se è preferito
              role="button" // dice che è come un bottone
              tabIndex={0} // si può selezionare con il tasto Tab
              aria-label={isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"} // spiega cosa fa per chi ascolta
              onKeyDown={(e) => { if (e.key === 'Enter') onToggleFavorite(); }} // premi Invio per attivare
            >


              {isFavorite ? "❤️" : "🤍"} {/* mostra cuore pieno o vuoto */}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
