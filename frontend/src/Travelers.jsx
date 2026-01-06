import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Travelers() {
    const [travelers, setTravelers] = useState([]);
    const [newTraveler, setNewTraveler] = useState({ name: '', age: '' });
    const [editingTraveler, setEditingTraveler] = useState(null);

    useEffect(() => {
        fetchTravelers();
    }, []);

    const fetchTravelers = () => {
        fetch('http://localhost:3000/travelers')
            .then((res) => res.json())
            .then((data) => setTravelers(data))
            .catch((err) => console.error('Error:', err));
    };

    const addTraveler = (e) => {
        e.preventDefault();
        fetch('http://localhost:3000/travelers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTraveler),
        })
            .then((res) => res.json())
            .then(() => {
                setNewTraveler({ name: '', age: '' });
                fetchTravelers();
            })
            .catch((err) => console.error('Error:', err));
    };

    const startEditing = (traveler) => {
        setEditingTraveler(traveler);
    };

    const updateTraveler = (e) => {
        e.preventDefault();
        if (!editingTraveler) return;

        fetch(`http://localhost:3000/travelers/${editingTraveler.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editingTraveler),
        })
            .then((res) => res.json())
            .then(() => {
                setEditingTraveler(null);
                fetchTravelers();
            })
            .catch((err) => console.error('Error:', err));
    };

    const deleteTraveler = (id) => {
        if (window.confirm('Da li ste sigurni da želite obrisati ovog putnika?')) {
            fetch(`http://localhost:3000/travelers/${id}`, {
                method: 'DELETE',
            })
                .then((res) => res.json())
                .then(() => {
                    fetchTravelers();
                })
                .catch((err) => console.error('Error:', err));
        }
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.header}>
                <h1 style={styles.title}>👤 Putnici</h1>
                <Link to="/">
                    <button style={styles.backButton}>← Nazad na početnu</button>
                </Link>
            </div>

            {/* Forma za dodavanje novog traveler-a */}
            <div style={styles.formCard}>
                <form onSubmit={addTraveler} style={styles.form}>
                    <h3 style={styles.formTitle}>➕ Dodaj novog putnika</h3>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Ime i prezime:</label>
                        <input
                            style={styles.input}
                            type="text"
                            placeholder="Unesite puno ime"
                            value={newTraveler.name}
                            onChange={(e) => setNewTraveler({ ...newTraveler, name: e.target.value })}
                            required
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Godine:</label>
                        <input
                            style={styles.input}
                            type="number"
                            placeholder="25"
                            value={newTraveler.age}
                            onChange={(e) => setNewTraveler({ ...newTraveler, age: e.target.value })}
                            required
                        />
                    </div>
                    <button style={styles.button} type="submit">Dodaj Putnika</button>
                </form>
            </div>

            {/* Forma za edit ako editingTraveler != null */}
            {editingTraveler && (
                <div style={styles.editCard}>
                    <form onSubmit={updateTraveler} style={styles.form}>
                        <h3 style={styles.formTitle}>✏️ Ažuriraj putnika (ID: {editingTraveler.id})</h3>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Ime:</label>
                            <input
                                style={styles.input}
                                type="text"
                                placeholder="Ime"
                                value={editingTraveler.name}
                                onChange={(e) => setEditingTraveler({ ...editingTraveler, name: e.target.value })}
                                required
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Godine:</label>
                            <input
                                style={styles.input}
                                type="number"
                                placeholder="Godine"
                                value={editingTraveler.age}
                                onChange={(e) => setEditingTraveler({ ...editingTraveler, age: e.target.value })}
                                required
                            />
                        </div>
                        <div style={styles.buttonGroup}>
                            <button style={styles.button} type="submit">Sačuvaj</button>
                            <button style={styles.buttonCancel} type="button" onClick={() => setEditingTraveler(null)}>Odustani</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Lista svih travelers */}
            <div style={styles.listSection}>
                <h3 style={styles.subTitle}>📋 Lista putnika</h3>
                {travelers.length === 0 ? (
                    <p style={styles.emptyMessage}>Nema upisanih putnika</p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Ime</th>
                            <th style={styles.th}>Godine</th>
                            <th style={styles.th}>Akcije</th>
                        </tr>
                        </thead>
                        <tbody>
                        {travelers.map((trav) => (
                            <tr key={trav.id} style={styles.tr}>
                                <td style={styles.td}>{trav.id}</td>
                                <td style={styles.td}><strong>{trav.name}</strong></td>
                                <td style={styles.td}>🎂 {trav.age} god.</td>
                                <td style={styles.td}>
                                    <button style={styles.buttonSmall} onClick={() => startEditing(trav)}>✏️ Edit</button>
                                    <button style={styles.buttonDelete} onClick={() => deleteTraveler(trav.id)}>🗑️ Obriši</button>
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
        color: '#388e3c',
        margin: 0,
        fontSize: '32px'
    },
    subTitle: {
        color: '#43a047',
        marginTop: 0
    },
    backButton: {
        backgroundColor: '#4caf50',
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
    buttonGroup: {
        display: 'flex',
        gap: '10px'
    },
    button: {
        backgroundColor: '#4caf50',
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
        backgroundColor: '#4caf50',
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
        backgroundColor: '#4caf50',
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
    emptyMessage: {
        textAlign: 'center',
        color: '#9e9e9e',
        fontSize: '16px',
        padding: '20px'
    }
};

export default Travelers;