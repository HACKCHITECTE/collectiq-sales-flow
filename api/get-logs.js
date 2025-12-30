// api/get-logs.js
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
    // Autoriser le GET et les options CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Méthode non autorisée' });

    const sql = neon(process.env.DATABASE_URL);

    try {
        // Récupérer uniquement le nom et le statut pour plus de légèreté
        const logs = await sql`
            SELECT prospect_name, status 
            FROM prospect_logs 
            ORDER BY created_at DESC
        `;
        
        return res.status(200).json(logs);
    } catch (error) {
        console.error('Erreur lecture Neon:', error);
        return res.status(500).json({ error: 'Impossible de lire l\'historique' });
    }
}