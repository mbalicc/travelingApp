import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Agencies() {
    const [agencies, setAgencies] = useState([]);
    const [newAgency, setNewAgency] = useState({ name: '', location: '' });
    const [editingAgency, setEditingAgency] = useState(null);
    const [viewingAgencyTrips, setViewingAgencyTrips] = useState(null);
    const [agencyTrips, setAgencyTrips] = useState([]);

    useEffect(() => {
        fetchAgencies();
    }, []);

    const fetchAgencies = () => {
        fetch('http://localhost:3000/agencies')
            .then((res) => res.json())
            .then((data) => setAgencies(data))
            .catch((err) => console.error('Error:', err));
    };

    const addAgency = (e) => {
        e.preventDefault();
        fetch('http://localhost:3000/agencies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newAgency),
        })
            .then((res) => res.json())
            .then(() => {
                setNewAgency({ name: '', location: '' });
                fetchAgencies();
            })
            .catch((err) => console.error('Error:', err));
    };

    const startEditing = (agency) => {
        setEditingAgency(agency);
        setViewingAgencyTrips(null);
    };

    const updateAgency = (e) => {
        e.preventDefault();
        if (!editingAgency) return;

        fetch(`http://localhost:3000/agencies/${editingAgency.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editingAgency),
        })
            .then((res) => res.json())
            .then(() => {
                setEditingAgency(null);
                fetchAgencies();
            })
            .catch((err) => console.error('Error:', err));
    };

    const deleteAgency = (id) => {
        if (window.confirm('Da li ste sigurni da želite obrisati ovu agenciju?')) {
            fetch(`http://localhost:3000/agencies/${id}`, {
                method: 'DELETE',
            })
                .then((res) => res.json())
                .then(() => {
                    fetchAgencies();
                })
                .catch((err) => console.error('Error:', err));
        }
    };

    const viewAgencyTrips = (agencyId) => {
        fetch(`http://localhost:3000/agencies/${agencyId}/trips`)
            .then((res) => res.json())
            .then((data) => {
                setAgencyTrips(data);
                setViewingAgencyTrips(agencyId);
                setEditingAgency(null);
            })
            .catch((err) => console.error('Error:', err));
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.header}>
                <h1 style={styles.title}>🏢 Turističke Agencije</h1>
                <Link to="/">
                    <button style={styles.backButton}>← Nazad na početnu</button>
                </Link>
            </div>

            {/* Forma za dodavanje nove agencije */}
            <div style={styles.formCard}>
                <form onSubmit={addAgency} style={styles.form}>
                    <h3 style={styles.formTitle}>➕ Dodaj novu agenciju</h3>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Naziv agencije:</label>
                        <input
                            style={styles.input}
                            type="text"
                            placeholder="Unesite naziv"
                            value={newAgency.name}
                            onChange={(e) => setNewAgency({ ...newAgency, name: e.target.value })}
                            required
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Lokacija:</label>
                        <input
                            style={styles.input}
                            type="text"
                            placeholder="Grad, Država"
                            value={newAgency.location}
                            onChange={(e) => setNewAgency({ ...newAgency, location: e.target.value })}
                            required
                        />
                    </div>
                    <button style={styles.button} type="submit">Dodaj Agenciju</button>
                </form>
            </div>

            {/* Forma za edit */}
            {editingAgency && (
                <div style={styles.editCard}>
                    <form onSubmit={updateAgency} style={styles.form}>
                        <h3 style={styles.formTitle}>✏️ Ažuriraj agenciju (ID: {editingAgency.id})</h3>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Naziv:</label>
                            <input
                                style={styles.input}
                                type="text"
                                placeholder="Naziv"
                                value={editingAgency.name}
                                onChange={(e) => setEditingAgency({ ...editingAgency, name: e.target.value })}
                                required
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Lokacija:</label>
                            <input
                                style={styles.input}
                                type="text"
                                placeholder="Lokacija"
                                value={editingAgency.location}
                                onChange={(e) => setEditingAgency({ ...editingAgency, location: e.target.value })}
                                required
                            />
                        </div>
                        <div style={styles.buttonGroup}>
                            <button style={styles.button} type="submit">Sačuvaj</button>
                            <button style={styles.buttonCancel} type="button" onClick={() => setEditingAgency(null)}>Odustani</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Prikaz putovanja za odabranu agenciju */}
            {viewingAgencyTrips && (
                <div style={styles.tripsSection}>
                    <div style={styles.tripsSectionHeader}>
                        <h3>🗺️ Putovanja agencije (ID: {viewingAgencyTrips})</h3>
                        <button style={styles.buttonCancel} onClick={() => setViewingAgencyTrips(null)}>✕ Zatvori</button>
                    </div>
                    {agencyTrips.length === 0 ? (
                        <p style={styles.emptyMessage}>Ova agencija nema putovanja.</p>
                    ) : (
                        <div style={styles.tripsGrid}>
                            {agencyTrips.map((trip) => (
                                <div key={trip.id} style={styles.tripMiniCard}>
                                    {trip.image && (
                                        <img src={trip.image} alt={trip.destination} style={styles.tripMiniImage} 
                                             onError={(e) => { e.target.style.display = 'none'; }} />
                                    )}
                                    <div style={styles.tripMiniContent}>
                                        <h4 style={styles.tripMiniTitle}>{trip.destination}</h4>
                                        <p><strong>Trajanje:</strong> {trip.duration} dana</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Lista svih agencija */}
            <div style={styles.listSection}>
                <h3 style={styles.subTitle}>📋 Sve Agencije</h3>
                {agencies.length === 0 ? (
                    <p style={styles.emptyMessage}>Nema upisanih agencija</p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Naziv</th>
                            <th style={styles.th}>Lokacija</th>
                            <th style={styles.th}>Akcije</th>
                        </tr>
                        </thead>
                        <tbody>
                        {agencies.map((agency) => (
                            <tr key={agency.id} style={styles.tr}>
                                <td style={styles.td}>{agency.id}</td>
                                <td style={styles.td}><strong>{agency.name}</strong></td>
                                <td style={styles.td}>📍 {agency.location}</td>
                                <td style={styles.td}>
                                    <button style={styles.buttonSmall} onClick={() => startEditing(agency)}>✏️ Edit</button>
                                    <button style={{...styles.buttonSmall, backgroundColor: '#26a69a'}} onClick={() => viewAgencyTrips(agency.id)}>🗺️ Putovanja</button>
                                    <button style={styles.buttonDelete} onClick={() => deleteAgency(agency.id)}>🗑️ Obriši</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
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
        color: '#1565c0',
        margin: 0,
        fontSize: '32px'
    },
    subTitle: {
        color: '#1976d2',
        marginTop: 0
    },
    backButton: {
        backgroundColor: '#1976d2',
        color: '#fff',
        border: 'none',
        padding: '12px 24px',
        cursor: 'pointer',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: 'bold',
        transition: 'all 0.3s',
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
        transition: 'border 0.3s',
        outline: 'none'
    },
    buttonGroup: {
        display: 'flex',
        gap: '10px'
    },
    button: {
        backgroundColor: '#1976d2',
        color: '#fff',
        border: 'none',
        padding: '12px 24px',
        cursor: 'pointer',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: 'bold',
        transition: 'all 0.3s',
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
        backgroundColor: '#1976d2',
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
    listSection: {
        backgroundColor: '#fff',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
    },
    table: {
        borderCollapse: 'collapse',
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: '8px',
        overflow: 'hidden'
    },
    th: {
        padding: '15px',
        textAlign: 'left',
        backgroundColor: '#1976d2',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '14px'
    },
    tr: {
        transition: 'background-color 0.2s'
    },
    td: {
        padding: '12px 15px',
        borderBottom: '1px solid #e0e0e0'
    },
    tripsSection: {
        backgroundColor: '#e3f2fd',
        padding: '20px',
        marginBottom: '25px',
        borderRadius: '10px',
        border: '2px solid #1976d2'
    },
    tripsSectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
    },
    tripsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '15px'
    },
    tripMiniCard: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    },
    tripMiniImage: {
        width: '100%',
        height: '120px',
        objectFit: 'cover'
    },
    tripMiniContent: {
        padding: '10px'
    },
    tripMiniTitle: {
        margin: '0 0 8px 0',
        color: '#1565c0',
        fontSize: '16px'
    },
    emptyMessage: {
        textAlign: 'center',
        color: '#9e9e9e',
        fontSize: '16px',
        padding: '20px'
    }
};

export default Agencies;