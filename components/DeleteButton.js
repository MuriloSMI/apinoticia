'use client';

import { useRouter } from 'next/navigation';

export default function DeleteButton({ noticiaId, onDelete }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja excluir esta notícia?")) {
      return;
    }

    try {
      const response = await fetch(`/api/noticias/${noticiaId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDelete(noticiaId);
        alert('Notícia excluída com sucesso!');
      } else {
        const data = await response.json();
        alert(`Erro ao excluir: ${data.error || 'Falha na API.'}`);
      }
    } catch (error) {
      console.error('Erro de rede/conexão:', error);
      alert('Erro de conexão com o servidor ao tentar excluir.');
    }
  };

  return (
    <span 
      onClick={handleDelete}
      style={{ 
        color: '#dc3545', 
        cursor: 'pointer', 
        marginLeft: '15px'
      }}
    >
      Excluir
    </span>
  );
}