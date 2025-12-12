'use client'; 

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

const CATEGORIAS = ['Educação', 'Ciência', 'Entretenimento', 'Outros'];

export default function EditarNoticia() { 
  const params = useParams();
  const id = params.id;

  const [formData, setFormData] = useState({
    titulo: '',
    conteudo: '',
    categoria: CATEGORIAS[0],
    dataPublicacao: '',
  });
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    const fetchNoticia = async () => {
      try {
        const response = await fetch(`/api/noticias/${id}`);
        
        if (!response.ok) {
          throw new Error('Notícia não encontrada ou falha na API.');
        }

        const data = await response.json();
        
        setFormData({
          titulo: data.data.titulo || '',
          conteudo: data.data.conteudo || '',
          categoria: data.data.categoria || CATEGORIAS[0],
          dataPublicacao: data.data.dataPublicacao || '',
        });
        setLoading(false);
      } catch (error) {
        setMensagem({ type: 'error', text: `Erro ao carregar dados: ${error.message}` });
        setLoading(false);
      }
    };
    
    if (id) {
      fetchNoticia();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem(null);

    const { dataPublicacao, ...updateBody } = formData;

    try {
      const response = await fetch(`/api/noticias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateBody),
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem({ type: 'success', text: 'Notícia atualizada com sucesso!' });
        
        setTimeout(() => {
          router.push('/');
        }, 2000);
        
      } else {
        setMensagem({ type: 'error', text: `Erro ao atualizar: ${data.error || 'Falha ao processar.'}` });
      }

    } catch (error) {
      console.error('Erro de rede/conexão:', error);
      setMensagem({ type: 'error', text: 'Erro de conexão com o servidor.' });
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Carregando dados da notícia...</div>;
  }
  
  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1>Editar Notícia</h1>
      <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '20px' }}>ID: {id}</p>

      {mensagem && (
        <p style={{ 
          color: mensagem.type === 'success' ? 'green' : 'red', 
          padding: '10px', 
          border: `1px solid ${mensagem.type === 'success' ? 'green' : 'red'}`,
          backgroundColor: mensagem.type === 'success' ? '#e6ffe6' : '#ffe6e6',
        }}>
          {mensagem.text}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="titulo" style={{ display: 'block', marginBottom: '5px' }}>Título:</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="conteudo" style={{ display: 'block', marginBottom: '5px' }}>Conteúdo:</label>
          <textarea
            id="conteudo"
            name="conteudo"
            value={formData.conteudo}
            onChange={handleChange}
            required
            rows="6"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          ></textarea>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="categoria" style={{ display: 'block', marginBottom: '5px' }}>Tipo (Categoria):</label>
          <select
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          >
            {CATEGORIAS.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <button 
          type="submit" 
          style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
        >
          Salvar Edição
        </button>
        <button 
          type="button" 
          onClick={() => router.push('/')}
          style={{ padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}