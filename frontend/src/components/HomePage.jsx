import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  // Stato per tutte le auto recuperate dal server
  const [cars, setCars] = useState([]);

  // Stato per le auto filtrate in base a categoria e ordinamento
  const [filteredCars, setFilteredCars] = useState([]);

  // Categoria selezionata nel filtro
  const [selectedCategory, setSelectedCategory] = useState("");

  // Opzione di ordinamento selezionata
  const [sortOption, setSortOption] = useState("");

  // Lista dei preferiti salvati in localStorage (inizializzata al caricamento)
  const [preferiti, setPreferiti] = useState(() => {
    return JSON.parse(localStorage.getItem("preferiti")) || [];
  });

  // Hook per navigare tra le pagine
  const navigate = useNavigate();

  // Effetto per caricare la lista delle auto da API quando il componente si monta
  useEffect(() => {
    const fetchCars = async () => {
      try {
        
        const res = await fetch('http://localhost:3001/cars');
        const data = await res.json();

        // Per ogni id, faccio una chiamata per ottenere i dettagli completi
        const ids = data.map(c => c.id);
        const detailedResponses = await Promise.all(
          ids.map(id =>
            fetch(`http://localhost:3001/cars/${id}`)
              .then(res => res.json())
              .then(data => (data.car))
          )
        );

        // Salvo le auto dettagliate nello stato
        setCars(detailedResponses);
      } catch (error) {
        console.error('Errore nel fetch:', error);
      }
    };
    fetchCars();
  }, []);

  // Effetto per filtrare e ordinare le auto quando cambia la categoria, l'ordinamento o la lista auto
  useEffect(() => {
    // Filtra in base alla categoria selezionata, se presente
    let filtered = selectedCategory
      ? cars.filter(
          (car) => car.category.toLowerCase() === selectedCategory.toLowerCase()
        )
      : [...cars];

    // Se c'è un ordinamento selezionato, ordina la lista filtrata
    if (sortOption) {
      filtered.sort((a, b) => {
        const field = sortOption.includes("title") ? "title" : "category"; // campo per ordinare
        const isAsc = sortOption.endsWith("asc"); // ordine crescente o decrescente
        return isAsc
          ? a[field].localeCompare(b[field])
          : b[field].localeCompare(a[field]);
      });
    }
    // Aggiorna lo stato con la lista filtrata e ordinata
    setFilteredCars(filtered);
  }, [selectedCategory, sortOption, cars]);

  // Funzione per aggiungere o rimuovere un'auto dai preferiti
  const togglePreferito = (auto) => {
    let updatedPreferiti;
    if (preferiti.find((p) => p.id === auto.id)) {
      // Se l'auto è già nei preferiti, la rimuove
      updatedPreferiti = preferiti.filter((p) => p.id !== auto.id);
    } else {
      // Altrimenti la aggiunge
      updatedPreferiti = [...preferiti, auto];
    }
    setPreferiti(updatedPreferiti);
    // Aggiorna i preferiti anche su localStorage così rimangono salvati
    localStorage.setItem("preferiti", JSON.stringify(updatedPreferiti));
  };

  // Funzione di utilità per sapere se un'auto è tra i preferiti
  const isPreferita = (auto) => preferiti.some((p) => p.id === auto.id);

  // Ricava le categorie uniche dalle auto per il filtro a tendina
  const categories = Array.from(new Set(cars.map(car => car.category)));

  return (
    <div style={{ padding: "20px" }}>
      {/* Sezione filtro categoria e ordinamento */}
      <div style={{ marginBottom: "16px", display: "flex", gap: "16px" }}>
        <div>
          <label htmlFor="category-select">Categoria:</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            style={{ marginLeft: "8px" }}
          >
            <option value="">Tutte</option>
            {/* Opzioni per ogni categoria unica */}
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sort-select">Ordina per:</label>
          <select
            id="sort-select"
            value={sortOption}
            onChange={e => setSortOption(e.target.value)}
            style={{ marginLeft: "8px" }}
          >
            <option value="">Nessuno</option>
            <option value="title-asc">Titolo (A-Z)</option>
            <option value="title-desc">Titolo (Z-A)</option>
            <option value="category-asc">Categoria (A-Z)</option>
            <option value="category-desc">Categoria (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Lista delle auto filtrate e ordinate */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {filteredCars.map((car) => (
          <div
            key={car.id}
            onClick={() => navigate(`/cars/${car.id}`)} // cliccando vai ai dettagli dell'auto
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              width: "300px",
              textAlign: "center",
              cursor: "pointer",
              position: "relative",
            }}
          >
            <img
              src={car.image}
              alt={car.title}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
            <h3>{car.title}</h3>
            <p>{car.category}</p>

            {/* Cuoricino preferito cliccabile, non fa propagare il click al div principale */}
            <span
              onClick={(e) => {
                e.stopPropagation(); // blocca il click sul div esterno
                togglePreferito(car); // aggiungi o rimuovi dai preferiti
              }}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                fontSize: "24px",
                cursor: "pointer",
                color: isPreferita(car) ? "red" : "gray", // rosso se preferita, grigio se no
                userSelect: "none",
              }}
              aria-label={
                isPreferita(car)
                  ? `Rimuovi ${car.title} dai preferiti`
                  : `Aggiungi ${car.title} ai preferiti`
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  togglePreferito(car);
                }
              }}
            >
              {/* Mostra cuore pieno o vuoto */}
              {isPreferita(car) ? "❤️" : "🤍"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
