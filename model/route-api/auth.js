const { Lesson ,Users } = require('../models'); 

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const auth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '');
        const verify = jwt.verify(token, process.env.TOKEN_SECRET)
        const user = await Users.findOne({_id: verify._id})
        if(!user){
            res.status(404).send({
                status: false,
                message: 'cant found'
            })
        }
        req.user = user
        next()
    }catch(e){
        res.status(401).send({
            status:false,
            message: e.message
        })
    }
}

module.exports = auth