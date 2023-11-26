exports.authorize = (req, res, next) => {
    const apiKey = req.header('test');

    if (!apiKey || apiKey !== 'test') {
        return res.status(401).send('Unauthorized');
    }

    next();
};