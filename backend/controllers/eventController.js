const sql = `
SELECT 
    e.id AS event_id,
    e.title,
    e.description,
    e.date_start,
    e.date_end,
    e.location,
    e.created_at,

    SUM(CASE WHEN l.status = 'LIKE' THEN 1 ELSE 0 END) AS likes_count,
    SUM(CASE WHEN l.status = 'UNLIKE' THEN 1 ELSE 0 END) AS unlikes_count,

    GROUP_CONCAT(DISTINCT i.image_url) AS images,

    GROUP_CONCAT(
        DISTINCT CONCAT(
            c.id, ':::',
            c.content, ':::',
            c.created_at, ':::',
            u.id, ':::',
            u.name, ':::',
            u.email
        )
        SEPARATOR '||'
    ) AS comments

FROM events e
LEFT JOIN likes l        ON e.id = l.event_id
LEFT JOIN event_images i ON e.id = i.event_id
LEFT JOIN comments c     ON e.id = c.event_id
LEFT JOIN users u        ON c.user_id = u.id

GROUP BY e.id
ORDER BY e.created_at DESC`;

const pool = require('../db');

const getAllevents = async (req, res) => {
    try {
        const [rows] = await pool.query(sql);

        const events = rows.map(event => {
            event.images = event.images ? event.images.split(',') : [];
            
            event.comments = event.comments
                ? event.comments.split('||').map(c => {
                    const parts = c.split(':::');
                    return {
                        id: parts[0],
                        content: parts[1],
                        created_at: parts[2],
                        user_id: parts[3],
                        user_name: parts[4],
                        user_email: parts[5]
                    };
                })
                : [];

            return event;
        });
        res.status(200).json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Échec de la récupération des événements" });
    }
};


const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM events WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Événement non trouvé' });
        }
        res.status(200).json({ message: 'Événement supprimé avec succès' });
    } catch (error) {   
        res.status(500).json({ error: "Échec de la suppression de l'événement" });
    }
};

const createEvent = async (req, res) => {   
    try {
        const { title, description, date_start , date_end , location, created_by } = req.body;
        const [result] = await pool.query(

            `INSERT INTO events (title, description, date_start, date_end, location, created_by) 
            VALUES (?, ?, ?, ?, ?, ?)` ,
            [title, description, date_start , date_end , location, created_by]
        );
        res.status(201).json({
            id: result.insertId,
            title,
            description,
            date_start,
            date_end,
            location,
            created_by
        });
    } catch (error) {
        res.status(500).json({ error: "Échec de la création de l'événement" });
    }
};





module.exports = {  
    getAllevents
    // deleteEvent
    // createEvent,
    // getEventById
};  
