// import React from 'react';

// export default function CardPreferito({ auto, onRemove }) {
//   return (
//     <div style={{
//       border: '1px solid #ccc',
//       borderRadius: '8px',
//       padding: '12px',
//       marginBottom: '16px',
//       maxWidth: '300px',
//       boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
//     }}>
//       <h3>{auto.title}</h3>
//       <img src={auto.image} alt={auto.title} style={{ width: '100%', borderRadius: '4px' }} />
//       <p><strong>{auto.brand} - {auto.model}</strong></p>
//       <p><strong>Prezzo:</strong> €{auto.price.toLocaleString()}</p>
//       <p><strong>Categoria:</strong> {auto.category}</p>
//       <button onClick={() => onRemove(auto.id)} style={{
//         marginTop: '8px',
//         padding: '6px 12px',
//         backgroundColor: '#ff4d4d',
//         color: 'white',
//         border: 'none',
//         borderRadius: '4px',
//         cursor: 'pointer',
//       }}>
//         Rimuovi
//       </button>
//     </div>
//   );
// }
