import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
    // 1. Sécurité : On n'accepte que le POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    // 2. Connexion à Neon via la variable d'environnement
    const sql = neon(process.env.DATABASE_URL);

    // 3. Récupération des données envoyées par sales.html
    const { prospect_name, status, note, commercial_id } = req.body;

    try {
        // 4. Insertion dans la base Neon
        await sql`
            INSERT INTO prospect_logs (prospect_name, status, note, commercial_id)
            VALUES (${prospect_name}, ${status}, ${note}, ${commercial_id})
        `;
        
        // 5. Réponse de succès
        return res.status(200).json({ message: 'Enregistré avec succès' });
    } catch (error) {
        console.error('Erreur Neon:', error);
        return res.status(500).json({ error: 'Erreur lors de la sauvegarde' });
    }
}