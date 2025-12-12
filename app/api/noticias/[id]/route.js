import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Noticia from '../../../../models/Noticia';

const getNoticiaId = async (params) => {
    const unwrappedParams = await params; 
    return unwrappedParams.id;
};

export async function GET(request, { params }) {
    await dbConnect();
    const id = await getNoticiaId(params);

    try {
        const noticia = await Noticia.findById(id);

        if (!noticia) {
            return NextResponse.json({ success: false, error: 'Notícia não encontrada.' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: noticia }, { status: 200 });
    } catch (error) {
        console.error(`Erro ao buscar notícia ID ${id}:`, error.message);
        return NextResponse.json({ success: false, error: 'Falha ao buscar notícia.' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    await dbConnect();
    const id = await getNoticiaId(params);
    const body = await request.json();

    try {
        const noticia = await Noticia.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!noticia) {
            return NextResponse.json({ success: false, error: 'Notícia não encontrada para atualização.' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: noticia }, { status: 200 });
    } catch (error) {
        console.error(`Erro ao atualizar notícia ID ${id}:`, error.message);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return NextResponse.json({ success: false, error: messages.join(', ') }, { status: 400 });
        }
        return NextResponse.json({ success: false, error: 'Falha ao atualizar notícia.' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    await dbConnect();
    const id = await getNoticiaId(params);
    
    try {
        const deletedNoticia = await Noticia.deleteOne({ _id: id });

        if (deletedNoticia.deletedCount === 0) {
            return NextResponse.json({ success: false, error: 'Notícia não encontrada para exclusão.' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} }, { status: 200 });
    } catch (error) {
        console.error(`Erro ao excluir notícia ID ${id}:`, error.message);
        return NextResponse.json({ success: false, error: 'Falha ao excluir notícia.' }, { status: 500 });
    }
}