const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create a new database connection
const db = new sqlite3.Database(path.join(__dirname, 'database.db'), (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    // Create votes table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        candidate_id INTEGER NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create candidates table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS candidates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        party TEXT NOT NULL,
        position TEXT NOT NULL,
        image_url TEXT
      )
    `);
    
    // Insert sample candidates if they don't exist
    db.get("SELECT COUNT(*) as count FROM candidates", (err, row) => {
      if (err) {
        console.error(err.message);
        return;
      }
      
      if (row.count === 0) {
        const candidates = [
          {
            name: "Amit Sharma",
            party: "Bharatiya Janata Party",
            position: "Lok Sabha Candidate",
            image_url: "modi-2.avif"
          },
          {
            name: "Priya Patel",
            party: "Indian National Congress",
            position: "Lok Sabha Candidate",
            image_url: "Priyanka-joining-the-congress-party-Article-Image.avif"
          },
          {
            name: "Sunita Yadav",
            party: "Aam Aadmi Party",
            position: "Lok Sabha Candidate",
            image_url: "maxresdefault.jpg"
          },
          {
            name: "Rajesh Kumar",
            party: "Samajwadi Party",
            position: "Lok Sabha Candidate",
            image_url: "v7tm2gkg_akhilesh-yadav_625x300_09_October_24.webp"
          }
        ];
        
        const stmt = db.prepare("INSERT INTO candidates (name, party, position, image_url) VALUES (?, ?, ?, ?)");
        candidates.forEach(candidate => {
          stmt.run(candidate.name, candidate.party, candidate.position, candidate.image_url);
        });
        stmt.finalize();
        
        console.log("Sample candidates inserted");
      }
    });
  }
});

module.exports = db;