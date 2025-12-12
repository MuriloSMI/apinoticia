import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Noticia from '../../../models/Noticia';

export async function GET() {
  await dbConnect();

  try {
    const noticias = await Noticia.find({}).sort({ dataPublicacao: -1 });

    return NextResponse.json({ success: true, data: noticias }, { status: 200 });
  } catch (error) {
    console.error("Erro ao listar notícias:", error.message);
    return NextResponse.json(
      { success: false, error: 'Falha ao buscar as notícias.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await dbConnect();
  
  try {
    const body = await request.json(); 
    
    const novaNoticia = await Noticia.create(body);

    return NextResponse.json({ success: true, data: novaNoticia }, { status: 201 });
  } catch (error) {
    console.error("Erro ao cadastrar notícia:", error.message);

    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return NextResponse.json({ success: false, error: messages.join(', ') }, { status: 400 });
    }
    
    return NextResponse.json(
      { success: false, error: 'Falha interna ao cadastrar a notícia.' },
      { status: 500 }
    );
  }
}