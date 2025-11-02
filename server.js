const express = require('express');
const cors = require('cors');
const db = require('./database.js');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// API Endpoints

// GET all products
app.get('/api/products', (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
            res.status(500).json({ "error": err.message });
            return;
        }
        res.json(rows);
    });
});

// ADD a new product
app.post('/api/products', (req, res) => {
    const { id, name, price, stock } = req.body;
    db.run(`INSERT INTO products (id, name, price, stock) VALUES (?, ?, ?, ?)`, [id, name, price, stock], function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.status(201).json({ id: this.lastID });
    });
});

// UPDATE a product
app.put('/api/products/:id', (req, res) => {
    const { name, price, stock } = req.body;
    db.run(`UPDATE products SET name = ?, price = ?, stock = ? WHERE id = ?`, [name, price, stock, req.params.id], function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ updated: this.changes });
    });
});

// DELETE a product
app.delete('/api/products/:id', (req, res) => {
    db.run(`DELETE FROM products WHERE id = ?`, req.params.id, function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ deleted: this.changes });
    });
});


// GET all sales
app.get('/api/sales', (req, res) => {
    db.all("SELECT * FROM sales", [], (err, rows) => {
        if (err) {
            res.status(500).json({ "error": err.message });
            return;
        }
        // Items are stored as JSON strings, so parse them
        const sales = rows.map(sale => ({
            ...sale,
            items: JSON.parse(sale.items)
        }));
        res.json(sales);
    });
});

// ADD a new sale (and update stock)
app.post('/api/sales', (req, res) => {
    const { id, date, items, total } = req.body;

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        const stockUpdates = items.map(item => {
            return new Promise((resolve, reject) => {
                db.run(`UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?`, 
                    [item.quantity, item.id, item.quantity], 
                    function(err) {
                        if (err || this.changes === 0) {
                            reject(new Error(`Failed to update stock for ${item.name}. Not enough stock or product not found.`));
                        } else {
                            resolve();
                        }
                    }
                );
            });
        });

        Promise.all(stockUpdates)
            .then(() => {
                const itemsJson = JSON.stringify(items);
                db.run(`INSERT INTO sales (id, date, items, total) VALUES (?, ?, ?, ?)`, 
                    [id, date, itemsJson, total], 
                    function(err) {
                        if (err) {
                            db.run("ROLLBACK");
                            res.status(400).json({ "error": "Failed to record sale: " + err.message });
                        } else {
                            db.run("COMMIT");
                            res.status(201).json({ "message": "Sale recorded and stock updated." });
                        }
                    }
                );
            })
            .catch(error => {
                db.run("ROLLBACK");
                res.status(400).json({ "error": error.message });
            });
    });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
