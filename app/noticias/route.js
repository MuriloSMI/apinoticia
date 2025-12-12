import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('portalnoticias');
        
        const noticias = await db.collection('noticias').find({}).toArray();

        return NextResponse.json(noticias, { status: 200 });
        
    } catch (e) {
        console.error("Erro ao retornar a collection na rota /noticias:", e);
        return NextResponse.json(
            { error: "Falha ao acessar o banco de dados de notícias." }, 
            { status: 500 }
        );
    }
}