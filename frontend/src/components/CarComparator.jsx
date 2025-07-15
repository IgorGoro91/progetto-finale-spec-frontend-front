import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "./Card";

export default function CarComparator() {
  // Prendo dati passati da altre pagine (come id auto selezionata all'inizio)
  const location = useLocation();
  const navigate = useNavigate();
  const firstCarId = location.state?.firstCarId || null; // id prima auto selezionata
  const selectedCarIdsFromState = location.state?.selectedCarIds || []; // id auto selezionate

  // Stato per gestire varie cose:
  const [cars, setCars] = useState([]); // tutte le auto caricate dal server
  const [selectedCars, setSelectedCars] = useState([]); // auto selezionate per confronto
  const [preferiti, setPreferiti] = useState(() => {
    // preferiti presi da localStorage (salvati nel browser)
    return JSON.parse(localStorage.getItem("preferiti")) || [];
  });
  const [showComparisonDetail, setShowComparisonDetail] = useState(false); // se mostra dettaglio confronto
  const [loadingDetail, setLoadingDetail] = useState(false); // se sto caricando i dettagli

  const [selectedCategory, setSelectedCategory] = useState(""); // filtro categoria auto
  const [sortOption, setSortOption] = useState(""); // opzione ordinamento lista

  // Carica tutte le auto dal server quando componente monta
  useEffect(() => {
    fetch("http://localhost:3001/cars")
      .then(res => res.json())
      .then(async baseCars => {
        // Per ogni auto prendo i dettagli completi
        const carsWithDetails = await Promise.all(
          baseCars.map(async (car) => {
            try {
              const res = await fetch(`http://localhost:3001/cars/${car.id}`);
              const data = await res.json();
              return data.car;
            } catch (err) {
              console.error(`Errore caricamento dettagli per auto ${car.id}`, err);
              return car; // se errore ritorno auto base
            }
          })
        );
        setCars(carsWithDetails); // salvo auto dettagliate nello stato
      })
      .catch(err => console.error("Errore caricamento lista auto:", err));
  }, []);

  // Se c'è id di prima auto selezionata, la carico per impostare la selezione iniziale
  useEffect(() => {
    if (firstCarId) {
      fetch(`http://localhost:3001/cars/${firstCarId}`)
        .then(res => res.json())
        .then(data => setSelectedCars([data.car]))
        .catch(err => console.error("Errore caricamento auto iniziale:", err));
    }
  }, [firstCarId]);

  // Se arrivano da un'altra pagina due id di auto selezionate, carico quei dettagli
  useEffect(() => {
    if (selectedCarIdsFromState.length === 2) {
      setLoadingDetail(true); // mostro loading
      Promise.all(
        selectedCarIdsFromState.map(id =>
          fetch(`http://localhost:3001/cars/${id}`)
            .then(res => res.json())
            .then(data => data.car || data)
        )
      )
        .then(carsData => {
          setSelectedCars(carsData); // salvo le auto da confrontare
          setShowComparisonDetail(true); // mostro dettagli confronto
          setLoadingDetail(false); // tolgo loading
        })
        .catch(err => {
          console.error("Errore caricamento auto:", err);
          setLoadingDetail(false);
        });
    }
  }, [selectedCarIdsFromState]);

  // Funzione per selezionare/deselezionare un'auto nel confronto
  const toggleCar = (car) => {
    const alreadySelected = selectedCars.find(c => c.id === car.id);
    if (alreadySelected) {
      // se già selezionata, la tolgo dalla lista
      setSelectedCars(selectedCars.filter(c => c.id !== car.id));
    } else {
      // se no, la aggiungo (max 4 auto)
      if (selectedCars.length < 4) {
        fetch(`http://localhost:3001/cars/${car.id}`)
          .then(res => res.json())
          .then(data => {
            setSelectedCars(prev => [...prev, data.car]);
          })
          .catch(err => console.error("Errore caricamento dettagli auto:", err));
      } else {
        alert("Puoi selezionare solo 4 auto per confrontare");
      }
    }
  };

  // Funzione per aggiungere o togliere auto dai preferiti
  const togglePreferito = (car) => {
    let updatedPreferiti;
    if (preferiti.find(p => p.id === car.id)) {
      // se è già preferito lo tolgo
      updatedPreferiti = preferiti.filter(p => p.id !== car.id);
    } else {
      // altrimenti lo aggiungo
      updatedPreferiti = [...preferiti, car];
    }
    setPreferiti(updatedPreferiti); // aggiorno stato preferiti
    localStorage.setItem("preferiti", JSON.stringify(updatedPreferiti)); // salvo su localStorage
  };

  // Funzione per resettare la selezione auto e tornare alla lista
  const resetSelezione = () => {
    setSelectedCars([]);
    setShowComparisonDetail(false);
  };

  // Prendo tutte le categorie presenti nelle auto per il filtro
  const categories = Array.from(new Set(cars.map(car => car.category)));

  // Applico filtro categoria se selezionato
  let displayedCars = [...cars];
  if (selectedCategory) {
    displayedCars = displayedCars.filter(
      car => car.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }

  // Applico ordinamento se selezionato
  if (sortOption) {
    const field = sortOption.includes("title") ? "title" : "category";
    const isAsc = sortOption.endsWith("asc");
    displayedCars.sort((a, b) =>
      isAsc ? a[field].localeCompare(b[field]) : b[field].localeCompare(a[field])
    );
  }

  if (loadingDetail) return <p>Caricamento confronto...</p>;

  return (
    <div className="comparator-container" style={{ padding: "20px" }}>
      <h2>Confronta auto</h2>

      {/* Sezione filtro e ordinamento */}
      <div style={{ margin: "16px 0", display: "flex", gap: "16px" }}>
        <div>
          <label htmlFor="category-select">Categoria:</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            style={{ marginLeft: "8px" }}
          >
            <option value="">Tutte</option>
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

      {/* Box che mostra le auto selezionate e bottone per confronto */}
      {selectedCars.length > 0 && !showComparisonDetail && (
        <div style={{
          padding: "10px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
          minHeight: "50px",
        }}>
          {selectedCars.map(car => (
            <span
              key={car.id}
              style={{
                backgroundColor: "#dff0ff",
                padding: "6px 10px",
                borderRadius: "6px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                fontWeight: "bold"
              }}
            >
              {car.title}
            </span>
          ))}

          {/* Bottone "Confronta" abilitato se almeno 2 auto selezionate */}
          {selectedCars.length >= 2 && (
            <button
              onClick={() => setShowComparisonDetail(true)}
              style={{
                padding: "5px 10px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Confronta
            </button>
          )}
        </div>
      )}

      {/* Lista auto, mostrata solo se NON sto confrontando */}
      {!showComparisonDetail && (
        <div className="cars-grid" style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {displayedCars.map(car => (
            <Card
              key={car.id}
              {...car}
              isSelected={selectedCars.some(c => c.id === car.id)} // segna se auto è selezionata
              onToggle={() => toggleCar(car)} // funzione per selezionare/deselezionare auto
              isFavorite={preferiti.some(p => p.id === car.id)} // se auto è preferita
              onToggleFavorite={() => togglePreferito(car)} // funzione per preferiti
              showToggleButton
              showFavoriteHeart
            />
          ))}
        </div>
      )}

      {/* Dettaglio confronto: mostra auto selezionate in confronto */}
      {showComparisonDetail && (
        <>
          <div className="selected-cars" style={{
            display: "flex",
            gap: "20px",
            marginTop: "20px",
            flexWrap: "wrap"
          }}>
            {selectedCars.map(car => (
              <Card
                key={car.id}
                {...car}
                isSelected
                showToggleButton={false} // non mostro pulsante toggle in confronto
                isFavorite={preferiti.some(p => p.id === car.id)}
                onToggleFavorite={() => togglePreferito(car)}
                showFavoriteHeart
              />
            ))}
          </div>

          {/* Bottone per tornare alla selezione iniziale */}
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={resetSelezione}
              style={{
                backgroundColor: "#ccc",
                padding: "10px 15px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Torna alla selezione
            </button>
          </div>
        </>
      )}
    </div>
  );
}
