import { NextResponse } from 'next/server';
import dbConnect from '../../lib/dbConnect'; 
import Noticia from '../../models/Noticia'; 

/**
 * @returns {NextResponse}
 */
export async function GET() {
    try {
        await dbConnect(); 

        const noticias = await Noticia.find({}).exec();

        return NextResponse.json(noticias, { status: 200 });
        
    } catch (e) {
        console.error("Erro ao retornar a collection na rota /noticias:", e);
        return NextResponse.json(
            { error: "Falha interna ao acessar o banco de dados (Mongoose)." }, 
            { status: 500 }
        );
    }
}
