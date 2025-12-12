'use client'; 

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function VisualizarNoticia() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNoticia = async () => {
      try {
        const response = await fetch(`/api/noticias/${id}`);
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Notícia não encontrada.');
        }

        const data = await response.json();
        setNoticia(data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    if (id) {
      fetchNoticia();
    }
  }, [id]);

  const formatarData = (dataString) => {
    const options = { 
        year: 'numeric', month: 'long', day: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
    };
    return new Date(dataString).toLocaleDateString('pt-BR', options);
  };


  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2rem' }}>Carregando notícia...</div>;
  }

  if (error || !noticia) {
    return (
      <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', textAlign: 'center', border: '1px solid #dc3545', backgroundColor: '#f8d7da', color: '#721c24' }}>
        <h2>Erro ao carregar Notícia</h2>
        <p>{error}</p>
        <button onClick={() => router.push('/')} style={{ marginTop: '20px', padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Voltar para Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '30px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '15px', color: '#333' }}>{noticia.titulo}</h1>
      
      <p style={{ fontSize: '1rem', color: '#666', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        Categoria: {noticia.categoria} | Publicado em: {formatarData(noticia.dataPublicacao)}
      </p>

      {}
      <div style={{ fontSize: '1.1rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
        {noticia.conteudo}
      </div>

      <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
        <button 
          onClick={() => router.push('/')}
          style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
        >
          &larr; Voltar para a Home
        </button>
        <button 
          onClick={() => router.push(`/editar/${id}`)}
          style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Editar Notícia
        </button>
      </div>
    </div>
  );
}