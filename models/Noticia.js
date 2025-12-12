import mongoose from 'mongoose';

const NoticiaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'O título é obrigatório'],
    maxlength: [100, 'Título muito longo'],
  },
  conteudo: {
    type: String,
    required: [true, 'O conteúdo é obrigatório'],
  },
  categoria: {
    type: String,
    required: true,
    enum: ['Educação', 'Ciência', 'Entretenimento', 'Outros'],
    default: 'Outros'
  },
  dataPublicacao: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Noticia || mongoose.model('Noticia', NoticiaSchema);