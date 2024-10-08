import express from 'express';
import jwt from 'jsonwebtoken';

import { currentUser } from '@racf-pedalsound/common';

const router = express.Router();

// Se agrega un middleware de currentUser para evaluar si la cookie 
// (si es que hay) del usuario es válida.
router.get('/api/users/currentuser', currentUser, (req, res) => {
    res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };