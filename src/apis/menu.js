// routes/menus.js
const express = require('express');
const router = express.Router();
const { db } = require('../firebase');

/**
 * @swagger
 * tags:
 *   name: Menus
 *   description: API for managing dining menus
 */

/**
 * @swagger
 * /api/menus:
 *   get:
 *     summary: Get all menus
 *     tags: [Menus]
 *     responses:
 *       200:
 *         description: List of menus
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Menu'
 */
router.get('/', async (req, res) => {
  try {
    const menusSnapshot = await db.collection('menus').get();
    const menus = [];
    menusSnapshot.forEach(doc => {
      menus.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/menus/{id}:
 *   get:
 *     summary: Get a menu by ID
 *     tags: [Menus]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Menu ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Menu'
 *       404:
 *         description: Menu not found
 */
router.get('/:id', async (req, res) => {
  try {
    const menuDoc = await db.collection('menus').doc(req.params.id).get();
    if (!menuDoc.exists) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    res.status(200).json({ id: menuDoc.id, ...menuDoc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/menus:
 *   post:
 *     summary: Create a new menu
 *     tags: [Menus]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Menu'
 *     responses:
 *       201:
 *         description: Menu created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Menu'
 *       400:
 *         description: Bad request
 */
router.post('/', async (req, res) => {
  try {
    const { name, nutritionalInfo, ingredients, date } = req.body;
    if (!name || !nutritionalInfo || !ingredients || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const newMenu = { name, nutritionalInfo, ingredients, date };
    const docRef = await db.collection('menus').add(newMenu);
    res.status(201).json({ id: docRef.id, ...newMenu });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/menus/{id}:
 *   put:
 *     summary: Update a menu by ID
 *     tags: [Menus]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Menu ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Menu'
 *     responses:
 *       200:
 *         description: Menu updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Menu'
 *       404:
 *         description: Menu not found
 */
router.put('/:id', async (req, res) => {
  try {
    const menuRef = db.collection('menus').doc(req.params.id);
    const menuDoc = await menuRef.get();
    if (!menuDoc.exists) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    await menuRef.update(req.body);
    const updatedMenu = await menuRef.get();
    res.status(200).json({ id: updatedMenu.id, ...updatedMenu.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/menus/{id}:
 *   delete:
 *     summary: Delete a menu by ID
 *     tags: [Menus]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Menu ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu deleted successfully
 *       404:
 *         description: Menu not found
 */
router.delete('/:id', async (req, res) => {
  try {
    const menuRef = db.collection('menus').doc(req.params.id);
    const menuDoc = await menuRef.get();
    if (!menuDoc.exists) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    await menuRef.delete();
    res.status(200).json({ message: 'Menu deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;