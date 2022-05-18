const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        // const error = new Error('Not authenticated!.')
        res.status(401).json({message: 'Not authenticated!.'})
        // error.statusCode = 401;
        // throw error
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, 'jwtsecret'); // Verify method decodes and verify the token
    } catch (err) {
        err.statusCode = 500;
        throw err
    }

    if (!decodedToken) {
        res.status(401).json({message: 'Not authenticated!.'})
        // const error = new Error('Not authenticated!');
        // error.statusCode = 401;
        // throw error;
    }
    req.id = decodedToken.id;
    next();
}