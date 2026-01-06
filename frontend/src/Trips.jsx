import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Trips() {
    const [trips, setTrips] = useState([]);
    const [agencies, setAgencies] = useState([]);
    const [travelers, setTravelers] = useState([]);
    const [newTrip, setNewTrip] = useState({ destination: '', duration: '', image: '', agencyId: '' });
    const [editingTrip, setEditingTrip] = useState(null);
    const [managingTripId, setManagingTripId] = useState(null);
    const [tripTravelers, setTripTravelers] = useState([]);
    const [selectedTravelerId, setSelectedTravelerId] = useState('');

    useEffect(() => {
        fetchTrips();
        fetchAgencies();
        fetchTravelers();
    }, []);

    const fetchTrips = () => {
        fetch('http://localhost:3000/trips')
            .then((res) => res.json())
            .then((data) => setTrips(data))
            .catch((err) => console.error('Error:', err));
    };

    const fetchAgencies = () => {
        fetch('http://localhost:3000/agencies')
            .then((res) => res.json())
            .then((data) => setAgencies(data))
            .catch((err) => console.error('Error:', err));
    };

    const fetchTravelers = () => {
        fetch('http://localhost:3000/travelers')
            .then((res) => res.json())
            .then((data) => setTravelers(data))
            .catch((err) => console.error('Error:', err));
    };

    const fetchTripTravelers = (tripId) => {
        fetch(`http://localhost:3000/trips/${tripId}/travelers`)
            .then((res) => res.json())
            .then((data) => setTripTravelers(data))
            .catch((err) => console.error('Error:', err));
    };

    const addTrip = (e) => {
        e.preventDefault();
        fetch('http://localhost:3000/trips', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTrip),
        })
            .then((res) => res.json())
            .then(() => {
                setNewTrip({ destination: '', duration: '', image: '', agencyId: '' });
                fetchTrips();
            })
            .catch((err) => console.error('Error:', err));
    };

    const startEditing = (trip) => {
        setEditingTrip(trip);
        setManagingTripId(null);
    };

    const updateTrip = (e) => {
        e.preventDefault();
        if (!editingTrip) return;

        fetch(`http://localhost:3000/trips/${editingTrip.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editingTrip),
        })
            .then((res) => res.json())
            .then(() => {
                setEditingTrip(null);
                fetchTrips();
            })
            .catch((err) => console.error('Error:', err));
    };

    const deleteTrip = (id) => {
        if (window.confirm('Da li ste sigurni da želite obrisati ovo putovanje?')) {
            fetch(`http://localhost:3000/trips/${id}`, {
                method: 'DELETE',
            })
                .then((res) => res.json())
                .then(() => {
                    fetchTrips();
                })
                .catch((err) => console.error('Error:', err));
        }
    };

    const startManagingTravelers = (tripId) => {
        setManagingTripId(tripId);
        setEditingTrip(null);
        fetchTripTravelers(tripId);
    };

    const addTravelerToTrip = () => {
        if (!selectedTravelerId || !managingTripId) return;

        fetch(`http://localhost:3000/trips/${managingTripId}/travelers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ travelerId: selectedTravelerId }),
        })
            .then((res) => res.json())
            .then(() => {
                setSelectedTravelerId('');
                fetchTripTravelers(managingTripId);
            })
            .catch((err) => console.error('Error:', err));
    };

    const removeTravelerFromTrip = (travelerId) => {
        if (!managingTripId) return;

        fetch(`http://localhost:3000/trips/${managingTripId}/travelers/${travelerId}`, {
            method: 'DELETE',
        })
            .then((res) => res.json())
            .then(() => {
                fetchTripTravelers(managingTripId);
            })
            .catch((err) => console.error('Error:', err));
    };

    const getAgencyName = (agencyId) => {
        const agency = agencies.find(a => a.id === agencyId);
        return agency ? agency.name : 'N/A';
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.header}>
                <h1 style={styles.title}>✈️ Putovanja</h1>
                <Link to="/">
                    <button style={styles.backButton}>← Nazad na početnu</button>
                </Link>
            </div>

            {/* Forma za dodavanje novog putovanja */}
            <div style={styles.formCard}>
                <form onSubmit={addTrip} style={styles.form}>
                    <h3 style={styles.formTitle}>➕ Dodaj novo putovanje</h3>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Destinacija:</label>
                        <input
                            style={styles.input}
                            type="text"
                            placeholder="npr. Pariz, Rim, Tokio..."
                            value={newTrip.destination}
                            onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
                            required
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Trajanje (dani):</label>
                        <input
                            style={styles.input}
                            type="number"
                            placeholder="5"
                            value={newTrip.duration}
                            onChange={(e) => setNewTrip({ ...newTrip, duration: e.target.value })}
                            required
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>URL slike destinacije:</label>
                        <input
                            style={styles.input}
                            type="text"
                            placeholder="https://..."
                            value={newTrip.image}
                            onChange={(e) => setNewTrip({ ...newTrip, image: e.target.value })}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Agencija:</label>
                        <select
                            style={styles.select}
                            value={newTrip.agencyId}
                            onChange={(e) => setNewTrip({ ...newTrip, agencyId: e.target.value })}
                            required
                        >
                            <option value="">Izaberite agenciju</option>
                            {agencies.map((agency) => (
                                <option key={agency.id} value={agency.id}>
                                    {agency.name} ({agency.location})
                                </option>
                            ))}
                        </select>
                    </div>
                    <button style={styles.button} type="submit">Dodaj Putovanje</button>
                </form>
            </div>

            {/* Forma za edit */}
            {editingTrip && (
                <div style={styles.editCard}>
                    <form onSubmit={updateTrip} style={styles.form}>
                        <h3 style={styles.formTitle}>✏️ Ažuriraj putovanje (ID: {editingTrip.id})</h3>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Destinacija:</label>
                            <input
                                style={styles.input}
                                type="text"
                                value={editingTrip.destination}
                                onChange={(e) => setEditingTrip({ ...editingTrip, destination: e.target.value })}
                                required
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Trajanje (dani):</label>
                            <input
                                style={styles.input}
                                type="number"
                                value={editingTrip.duration}
                                onChange={(e) => setEditingTrip({ ...editingTrip, duration: e.target.value })}
                                required
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>URL slike:</label>
                            <input
                                style={styles.input}
                                type="text"
                                value={editingTrip.image || ''}
                                onChange={(e) => setEditingTrip({ ...editingTrip, image: e.target.value })}
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Agencija:</label>
                            <select
                                style={styles.select}
                                value={editingTrip.agencyId || ''}
                                onChange={(e) => setEditingTrip({ ...editingTrip, agencyId: e.target.value })}
                                required
                            >
                                <option value="">Izaberite agenciju</option>
                                {agencies.map((agency) => (
                                    <option key={agency.id} value={agency.id}>
                                        {agency.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div style={styles.buttonGroup}>
                            <button style={styles.button} type="submit">Sačuvaj</button>
                            <button style={styles.buttonCancel} type="button" onClick={() => setEditingTrip(null)}>Odustani</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Sekcija za upravljanje putnicima */}
            {managingTripId && (
                <div style={styles.manageTravelersSection}>
                    <div style={styles.manageTravelersHeader}>
                        <h3>👥 Upravljanje putnicima - Putovanje ID: {managingTripId}</h3>
                        <button style={styles.buttonCancel} onClick={() => setManagingTripId(null)}>✕ Zatvori</button>
                    </div>
                    
                    <div style={styles.addTravelerForm}>
                        <select
                            style={styles.select}
                            value={selectedTravelerId}
                            onChange={(e) => setSelectedTravelerId(e.target.value)}
                        >
                            <option value="">Izaberi putnika...</option>
                            {travelers.filter(t => !tripTravelers.find(tt => tt.id === t.id)).map((traveler) => (
                                <option key={traveler.id} value={traveler.id}>
                                    {traveler.name} ({traveler.age} god.)
                                </option>
                            ))}
                        </select>
                        <button style={styles.button} onClick={addTravelerToTrip}>Dodaj putnika</button>
                    </div>

                    <div style={styles.travelersList}>
                        <h4>Putnici na ovom putovanju:</h4>
                        {tripTravelers.length === 0 ? (
                            <p style={styles.emptyMessage}>Nema putnika na ovom putovanju.</p>
                        ) : (
                            <ul style={styles.list}>
                                {tripTravelers.map((traveler) => (
                                    <li key={traveler.id} style={styles.listItem}>
                                        <span>👤 {traveler.name} ({traveler.age} god.)</span>
                                        <button 
                                            style={styles.removeButton} 
                                            onClick={() => removeTravelerFromTrip(traveler.id)}
                                        >
                                            ✕ Ukloni
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}

            {/* Lista svih putovanja */}
            <div style={styles.listSection}>
                <h3 style={styles.subTitle}>🌍 Sva putovanja</h3>
                {trips.length === 0 ? (
                    <p style={styles.emptyMessage}>Nema upisanih putovanja</p>
                ) : (
                    <div style={styles.tripsGrid}>
                        {trips.map((trip) => (
                            <div key={trip.id} style={styles.tripCard}>
                                {trip.image && (
                                    <img 
                                        src={trip.image} 
                                        alt={trip.destination} 
                                        style={styles.tripImage}
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                )}
                                <div style={styles.tripContent}>
                                    <h4 style={styles.tripDestination}>{trip.destination}</h4>
                                    <p style={styles.tripDetail}><strong>📅 Trajanje:</strong> {trip.duration} dana</p>
                                    <p style={styles.tripDetail}><strong>🏢 Agencija:</strong> {getAgencyName(trip.agencyId)}</p>
                                    <p style={styles.tripDetail}><strong>🏷️ ID:</strong> {trip.id}</p>
                                    <div style={styles.tripActions}>
                                        <button style={styles.buttonSmall} onClick={() => startEditing(trip)}>✏️ Edit</button>
                                        <button style={{...styles.buttonSmall, backgroundColor: '#26a69a'}} onClick={() => startManagingTravelers(trip.id)}>👥 Putnici</button>
                                        <button style={styles.buttonDelete} onClick={() => deleteTrip(trip.id)}>🗑️ Obriši</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    pageContainer: {
        padding: '30px',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    title: {
        color: '#e65100',
        margin: 0,
        fontSize: '32px'
    },
    subTitle: {
        color: '#f57c00',
        marginTop: 0
    },
    backButton: {
        backgroundColor: '#ff9800',
        color: '#fff',
        border: 'none',
        padding: '12px 24px',
        cursor: 'pointer',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: 'bold',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    },
    formCard: {
        backgroundColor: '#ffffff',
        padding: '25px',
        marginBottom: '25px',
        borderRadius: '10px',
        boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
    },
    editCard: {
        backgroundColor: '#fff8e1',
        padding: '25px',
        marginBottom: '25px',
        borderRadius: '10px',
        boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
        border: '2px solid #ffd54f'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    formTitle: {
        margin: '0 0 15px 0',
        color: '#424242'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
    },
    label: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#616161'
    },
    input: {
        padding: '12px',
        fontSize: '14px',
        borderRadius: '6px',
        border: '2px solid #e0e0e0',
        outline: 'none'
    },
    select: {
        padding: '12px',
        fontSize: '14px',
        borderRadius: '6px',
        border: '2px solid #e0e0e0',
        outline: 'none',
        backgroundColor: '#fff'
    },
    buttonGroup: {
        display: 'flex',
        gap: '10px'
    },
    button: {
        backgroundColor: '#ff9800',
        color: '#fff',
        border: 'none',
        padding: '12px 24px',
        cursor: 'pointer',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: 'bold',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    },
    buttonCancel: {
        backgroundColor: '#d32f2f',
        color: '#fff',
        border: 'none',
        padding: '12px 24px',
        cursor: 'pointer',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: 'bold'
    },
    buttonSmall: {
        backgroundColor: '#ff9800',
        color: '#fff',
        border: 'none',
        padding: '6px 12px',
        marginRight: '5px',
        cursor: 'pointer',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold'
    },
    buttonDelete: {
        backgroundColor: '#d32f2f',
        color: '#fff',
        border: 'none',
        padding: '6px 12px',
        cursor: 'pointer',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold'
    },
    removeButton: {
        backgroundColor: '#d32f2f',
        color: '#fff',
        border: 'none',
        padding: '4px 8px',
        cursor: 'pointer',
        borderRadius: '4px',
        fontSize: '11px'
    },
    listSection: {
        backgroundColor: '#fff',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
    },
    tripsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '20px'
    },
    tripCard: {
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s'
    },
    tripImage: {
        width: '100%',
        height: '200px',
        objectFit: 'cover'
    },
    tripContent: {
        padding: '15px'
    },
    tripDestination: {
        color: '#e65100',
        marginTop: 0,
        marginBottom: '10px',
        fontSize: '20px'
    },
    tripDetail: {
        margin: '5px 0',
        fontSize: '14px',
        color: '#616161'
    },
    tripActions: {
        marginTop: '15px',
        display: 'flex',
        gap: '5px',
        flexWrap: 'wrap'
    },
    manageTravelersSection: {
        backgroundColor: '#e8f5e9',
        padding: '20px',
        marginBottom: '25px',
        borderRadius: '10px',
        border: '2px solid #4caf50'
    },
    manageTravelersHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
    },
    addTravelerForm: {
        display: 'flex',
        gap: '10px',
        marginBottom: '20px'
    },
    travelersList: {
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '8px'
    },
    list: {
        listStyle: 'none',
        padding: 0,
        margin: 0
    },
    listItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        marginBottom: '8px',
        backgroundColor: '#f5f5f5',
        borderRadius: '6px'
    },
    emptyMessage: {
        textAlign: 'center',
        color: '#9e9e9e',
        fontSize: '16px',
        padding: '20px'
    }
};

export default Trips;