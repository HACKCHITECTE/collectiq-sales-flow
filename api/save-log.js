// api/save-log.js
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
    // AJOUTER CES LIGNES POUR LE CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Gestion du Preflight (la requête 401 que tu vois)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    const sql = neon(process.env.DATABASE_URL);
    const { prospect_name, status, note, commercial_id } = req.body;

    try {
        await sql`
            INSERT INTO prospect_logs (prospect_name, status, note, commercial_id)
            VALUES (${prospect_name}, ${status}, ${note}, ${commercial_id})
        `;
        return res.status(200).json({ message: 'Succès' });
    } catch (error) {
        console.error('Erreur Neon:', error);
        return res.status(500).json({ error: 'Erreur base de données' });
    }
}