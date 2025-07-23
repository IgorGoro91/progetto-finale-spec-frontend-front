import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Hook  che restituisce un valore "ritardato", utile per ottimizzare richieste mentre l'utente digita
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value); // aggiorna il valore dopo il ritardo
    }, delay);

    return () => clearTimeout(handler); // se value cambia prima della scadenza, resetta il timer
  }, [value, delay]);

  return debouncedValue;
}

export default function SearchBar() {
  const [search, setSearch] = useState(""); // valore digitato nel campo input
  const [results, setResults] = useState([]); // risultati trovati dalla ricerca
  const [showList, setShowList] = useState(false); // stato che mostra/nasconde la lista dei suggerimenti
  const navigate = useNavigate(); // hook per la navigazione 
  const inputRef = useRef(null); // riferimento diretto all'input, per metterlo a fuoco

  const debouncedSearch = useDebounce(search, 300); // valore della ricerca ritardato di 300ms

  // Quando il componente si monta, mette subito il focus nell'input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Ogni volta che il valore "ritardato" cambia, esegue la ricerca
  useEffect(() => {
    if (debouncedSearch.length === 0) {
      setResults([]); // se la stringa è vuota, azzera i risultati
      setShowList(false); //  nasconde la lista
      return;
    }

    // Richiesta API per cercare auto in base alla stringa
    fetch(`http://localhost:3001/cars?q=${debouncedSearch}`)
      .then(res => res.json())
      .then(data => {
        // filtra le auto che iniziano con il testo digitato
        const filtered = data.filter(auto =>
          auto.title.toLowerCase().startsWith(debouncedSearch.toLowerCase())
        );
        setResults(filtered); // aggiorna i risultati
        setShowList(true); // mostra la lista
      })
      .catch(() => {
        setResults([]); // in caso di errore, lista vuota
        setShowList(false); // e lista nascosta
      });
  }, [debouncedSearch]);

  // Funzione chiamata quando si clicca su "Cerca" o si preme Invio
  const handleSearch = () => {
    if (results.length > 0) {
      const firstCar = results[0]; // prende la prima auto trovata
      setShowList(false); // chiude la lista
      setSearch(""); // resetta il campo input
      navigate(`/cars/${firstCar.id}`); // usa React Router per navigare alla pagina della prima auto trovata
    
    } else {
      alert("Nessuna auto trovata"); // messaggio se non ci sono risultati
    }
  };

  // Gestione del tasto Invio dentro l’input
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // Quando si clicca su un suggerimento della lista
  const handleSelect = (auto) => {
    setShowList(false); // nasconde la lista
    setSearch(""); // resetta il campo
    navigate(`/cars/${auto.id}`); // naviga alla pagina dell’auto
  };

  return (
    <div style={{ width: "300px" }}>
      <div style={{ display: "flex", gap: "8px" }}>
        <div style={{ position: "relative", flexGrow: 1 }}>
          <input
            ref={inputRef} // usato per accedere al DOM e mettere il focus con inputRef.current.focus()
            type="text"
            value={search} // valore dell’input
            onChange={e => setSearch(e.target.value)} // aggiorna lo stato mentre l’utente scrive
            onKeyDown={handleKeyDown} // ascolta il tasto Invio
            placeholder="Cerca auto..."
            autoComplete="off"
            style={{
              width: "100%",
              padding: "8px",
              boxSizing: "border-box",
              borderRadius: "4px",
              border: "1px solid #ccc"
            }}
          />
          {showList && results.length > 0 && (
            <ul
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "white",
                border: "1px solid #ccc",
                borderTop: "none",
                listStyle: "none",
                margin: 0,
                padding: 0,
                zIndex: 10
              }}
            >
              {results.map(auto => (
                <li
                  key={auto.id}
                  onClick={() => handleSelect(auto)} // selezione dalla lista
                  style={{
                    padding: "8px",
                    borderBottom: "1px solid #eee",
                    cursor: "pointer"
                  }}
                >
                  {auto.title} - {auto.brand}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={handleSearch} // click sul bottone "Cerca"
          style={{
            padding: "8px 16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            backgroundColor: "#007bff",
            color: "white",
            cursor: "pointer"
          }}
          type="button"
        >
          Cerca
        </button>
      </div>
    </div>
  );
}
