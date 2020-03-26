import React, {useEffect, useState} from "react";
import logoImg from '../../assets/logo.svg';
import {Link, useHistory} from 'react-router-dom';
import {FiPower} from 'react-icons/fi';
import {FiTrash2} from 'react-icons/fi';
import './styles.css';
import api from "../../services/api";

export default function Profile() {

    const name = localStorage.getItem("ongName");
    const ongID = localStorage.getItem("ongId");
    const history = useHistory();
    const [incidents, setIncidents] = useState([]);

    useEffect(() => {
        api.get('/profile', {
            headers: {
                Authorization: ongID
            }
        }).then(response => {
            setIncidents(response.data);
        });
    }, [ongID]);

    async function handleDeleteincident(id) {
        try{
            await api.delete(`/incidents/${id}`, {
                headers : {
                    Authorization: ongID
                }
            })

            setIncidents(incidents.filter(incident => incident.id !== id));
        } catch (e) {
            alert('Erro ao deletar')
        }
    }

    function headleLogout() {
        localStorage.clear();
        history.push('/');
    }

    return (
        <div className="profile-container">
            <header>
                <img src={logoImg} alt="be the hero"/>
                <span>Bem vido, {name}</span>

                <Link to="/incidents/new" className="button">Cadastrar novo caso</Link>
                <button onClick={headleLogout}>
                    <FiPower size={18} color="#e02041"/>
                </button>
            </header>
            <h1>Casos cadastrados</h1>
            <ul>
                {incidents.map(incident => (
                    <li key={incident.id}>
                        <strong>Caso:</strong>
                        <p>{incident.title}</p>

                        <strong>Descrição:</strong>
                        <p>{incident.description}</p>

                        <strong>Valor:</strong>
                        <p>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(incident.value)}</p>

                        <button
                            type="button"
                            onClick={() => handleDeleteincident(incident.id)}
                        >
                            <FiTrash2 size={20} color="a8a8b3" />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
