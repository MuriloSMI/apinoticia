'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIAS = ['Educação', 'Ciência', 'Entretenimento', 'Outros'];

export default function CadastrarNoticia() {
  const [formData, setFormData] = useState({
    titulo: '',
    conteudo: '',
    categoria: CATEGORIAS[0],
  });
  const [mensagem, setMensagem] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem(null);

    try {
      const response = await fetch('/api/noticias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem({ type: 'success', text: 'Notícia cadastrada com sucesso!' });
        setFormData({
          titulo: '',
          conteudo: '',
          categoria: CATEGORIAS[0],
        });
        setTimeout(() => {
          router.push('/');
        }, 2000);
        
      } else {
        setMensagem({ type: 'error', text: `Erro: ${data.error || 'Falha ao processar.'}` });
      }

    } catch (error) {
      console.error('Erro de rede/conexão:', error);
      setMensagem({ type: 'error', text: 'Erro de conexão com o servidor.' });
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1>Cadastrar Nova Notícia</h1>

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
          style={{ padding: '10px 15px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Salvar Notícia
        </button>
      </form>
    </div>
  );
}