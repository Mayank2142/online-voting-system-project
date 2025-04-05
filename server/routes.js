const express = require('express');
const router = express.Router();
const db = require('./db');

// Get all candidates
router.get('/candidates', (req, res) => {
  db.all("SELECT * FROM candidates", [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Failed to fetch candidates" });
    }
    res.json(rows);
  });
});

// Cast a vote
router.post('/vote', (req, res) => {
  const { candidateId } = req.body;
  
  if (!candidateId) {
    return res.status(400).json({ error: "Candidate ID is required" });
  }
  
  // Check if candidate exists
  db.get("SELECT id FROM candidates WHERE id = ?", [candidateId], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (!row) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    
    // Insert vote
    db.run("INSERT INTO votes (candidate_id) VALUES (?)", [candidateId], function(err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to record vote" });
      }
      
      res.status(201).json({ 
        message: "Vote recorded successfully", 
        voteId: this.lastID 
      });
    });
  });
});

// Get vote results
router.get('/results', (req, res) => {
  db.all(`
    SELECT 
      c.id,
      c.name,
      c.party,
      c.position,
      c.image_url,
      COUNT(v.id) as vote_count
    FROM candidates c
    LEFT JOIN votes v ON c.id = v.candidate_id
    GROUP BY c.id
    ORDER BY vote_count DESC
  `, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Failed to fetch results" });
    }
    
    // Calculate total votes
    db.get("SELECT COUNT(*) as total FROM votes", [], (err, row) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to fetch total votes" });
      }
      
      const totalVotes = row.total;
      
      // Add percentage to each candidate
      const results = rows.map(candidate => {
        return {
          ...candidate,
          percentage: totalVotes > 0 ? ((candidate.vote_count / totalVotes) * 100).toFixed(2) : 0
        };
      });
      
      res.json({
        totalVotes,
        candidates: results
      });
    });
  });
});

module.exports = router;