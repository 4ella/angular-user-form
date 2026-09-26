const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Signup API is running'
    });
});

app.post('/api/register', async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        password,
        repeatPassword,
        pincode
    } = req.body;

    if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !password ||
        !repeatPassword ||
        !pincode
    ) {
        return res.status(400).json({
            message: 'All fields are required'
        });
    }

    if (!/^[A-Za-z]+$/.test(firstName)) {
        return res.status(400).json({
            message: 'First name must contain only alphabets'
        });
    }

    if (!/^[A-Za-z]+$/.test(lastName)) {
        return res.status(400).json({
            message: 'Last name must contain only alphabets'
        });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
            message: 'Enter a valid email'
        });
    }

    if (!/^(?:[1-9][0-9]{9}|\+[1-9][0-9]{12})$/.test(phone)) {
        return res.status(400).json({
            message: 'Enter a valid phone number'
        });
    }

    if (!/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@#$&!]).{6,}$/.test(password)) {
        return res.status(400).json({
            message: 'Password must contain at least 6 characters, one alphabet, one number and one special character from @ # $ & !'
        });
    }

    if (password !== repeatPassword) {
        return res.status(400).json({
            message: 'Passwords do not match'
        });
    }

    if (!/^[0-9]{6}$/.test(pincode)) {
        return res.status(400).json({
            message: 'Pincode must contain exactly 6 digits'
        });
    }

    try {
        const pincodeSql =
            'SELECT * FROM pincodes WHERE pincode = ?';

        db.query(
            pincodeSql,
            [pincode],
            async (err, pincodeResults) => {

                if (err) {
                    return res.status(500).json({
                        message: 'Database error'
                    });
                }

                if (pincodeResults.length === 0) {
                    return res.status(400).json({
                        message: 'Invalid pincode'
                    });
                }

                const emailSql =
                    'SELECT id FROM users WHERE email = ?';

                db.query(
                    emailSql,
                    [email],
                    async (err, emailResults) => {

                        if (err) {
                            return res.status(500).json({
                                message: 'Database error'
                            });
                        }

                        if (emailResults.length > 0) {
                            return res.status(409).json({
                                message: 'Email already registered'
                            });
                        }

                        const hashedPassword =
                            await bcrypt.hash(password, 10);

                        const insertSql = `
                            INSERT INTO users
                            (
                                first_name,
                                last_name,
                                email,
                                phone,
                                password,
                                pincode
                            )
                            VALUES (?, ?, ?, ?, ?, ?)
                        `;

                        db.query(
                            insertSql,
                            [
                                firstName,
                                lastName,
                                email,
                                phone,
                                hashedPassword,
                                pincode
                            ],
                            (err, result) => {

                                if (err) {
                                    return res.status(500).json({
                                        message: 'Failed to register user'
                                    });
                                }

                                res.status(201).json({
                                    message: 'Registration successful',
                                    userId: result.insertId
                                });
                            }
                        );
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).json({
            message: 'Server error'
        });
    }
});

app.get('/api/users/:id', (req, res) => {

    const userId = req.params.id;

    const sql = `
        SELECT
            id,
            first_name,
            last_name,
            email,
            phone,
            pincode
        FROM users
        WHERE id = ?
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {
            return res.status(500).json({
                message: 'Database error'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.json(results[0]);
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});