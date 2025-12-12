'use client';

import { useState, useEffect } from 'react';
import DeleteButton from '../components/DeleteButton';

async function fetchNoticias() {
    const API_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://apinews-rosy.vercel.app/';
    try {
        const response = await fetch(`${API_URL}/api/noticias`, {
            cache: 'no-store'
        });
        if (!response.ok) throw new Error(`Erro ao buscar dados: ${response.statusText}`);
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error("Falha na busca de notícias:", error);
        return [];
    }
}

export default function Home() {
    const [noticias, setNoticias] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchNoticias().then(data => {
            setNoticias(data);
            setIsLoading(false);
        });
    }, []);

    const handleNoticiaDelete = (id) => {
        setNoticias(prevNoticias =>
            prevNoticias.filter(noticia => noticia._id !== id)
        );
    };

    const formatarData = (dataString) => {
        const options = {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        };
        return new Date(dataString).toLocaleDateString('pt-BR', options);
    };

    return (
        <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #0070f3', paddingBottom: '10px' }}>
                <h1>Portal Notícias</h1>
                <a
                    href="/cadastrar"
                    style={{ textDecoration: 'none', backgroundColor: '#0070f3', color: 'white', padding: '10px 15px', borderRadius: '4px' }}
                >
                    Cadastrar Nova
                </a>
            </header>

            {isLoading && <p style={{ textAlign: 'center' }}>Carregando notícias...</p>}

            {!isLoading && noticias.length === 0 ? (
                <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#555' }}>
                    Nenhuma notícia encontrada.
                </p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    {noticias.map((noticia) => (
                        <div key={noticia._id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                            <h2 style={{ color: '#0070f3', marginTop: '0' }}>
                                <a
                                    href={`/noticia/${noticia._id}`}
                                    style={{ textDecoration: 'none', color: 'inherit' }} // Herdando a cor do <h2>
                                >
                                    {noticia.titulo}
                                </a>
                            </h2>
                            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '10px' }}>
                                Categoria: {noticia.categoria} | Publicado em: {formatarData(noticia.dataPublicacao)}
                            </p>
                            <p>{noticia.conteudo.substring(0, 150)}</p>

                            <div style={{ marginTop: '15px' }}>
                                <a
                                    href={`/editar/${noticia._id}`}
                                    style={{ color: '#28a745', textDecoration: 'none' }}
                                >
                                    Editar
                                </a>

                                { }
                                <DeleteButton
                                    noticiaId={noticia._id}
                                    onDelete={handleNoticiaDelete}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

}
