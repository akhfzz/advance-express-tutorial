const {Lesson, Users, upload} = require('../models');
const {hash, jwt, dotenv, auth, route} = require('./app')
const mongoose = require('mongoose');
const e = require('express');

dotenv.config()

route.post('/upload-image', auth, upload.single('profile'), async(req, res) => {
    req.user.profile = req.file.filename
    console.log(req.file)
    await req.user.save()
    if(req.body.upload == ''){
        res.status(400).send({
            status: false,
            message: 'Cant null'
        })
        return
    }
    res.status(200).send({
        status: true,
        message: 'File has been uploaded'
    })
    return
}, (err, req, res, next) => {
    res.status(400).send({
        status: false,
        message: err.message
    })
})

route.post('/add', async (req, res) => {
    const obj = new Users(req.body);
    const valid = obj.validateSync()
    if(valid){
        res.status(400).send({
            status:false,
            message: {
                email: valid.errors['email'] ? valid.errors['email'].message : '',
                username: valid.errors['username'] ? valid.errors['username'].message: ''
            }
        })
        return
    }

    let find = await Users.findOne({email: obj.email});

    obj.password = await hash.hash(obj.password, 10);

    try{
        if(!find){
            try{
                obj.save();
            }catch(e){
                console.log(e.message)
            }
            res.status(201).send({
                status: true,
                message:"Successfully creates"
            })
            return
        }
        res.status(400).send({
            status: false,
            message: 'Failed creates'
        })
        return
    }catch(err){
        res.status(400).send({
            status: false,
            message: err
        })
        return
    }
})

route.post('/lesson-add', auth, async (req, res) => {
    const obj = new Lesson({...req.body, user_id: req.user._id});
    let valid = obj.validateSync()
    if(valid){
        res.status(400).send({
           status:false,
           message: valid.errors['sks'].message 
        })
        return
    }
    let getLesson = await Lesson.findOne({code: obj.code})

    try{
        if(!getLesson){
            obj.save()
            res.status(201).send({
                status: true,
                message: 'Lesson created'
            })
            return;
        }
        res.status(400).send({
            status:false,
            message: 'Lesson available'
        })
        return
    }catch(e){
        res.status(500).send({
            status: false,
            message: e.message
        })
        return
    }
})

route.patch('/update/:id', auth,async (req, res) => {
    const fields = Object.keys(req.body);
    const allowedUpdate = ['username', 'password'];
    const validation = fields.every((update) => allowedUpdate.includes(update));

    if(!validation){
        res.status(400).send({
            status: false,
            message: "Cant validate input"
        })
        return
    }
    data = {
        username: req.body.username,
        password: await hash.hash(req.body.password, 10)
    }

    let varPatch = await Users.findOneAndUpdate(req.params.id, data, {new:true, runvalidators:true});

    try{
        if(!varPatch){
            res.status(404).send({
                status:false,
                message: "Not found"
            })
        }
        varPatch.save();
        res.status(201).send(varPatch);
        return
    }catch(e){
        res.status(500).send(e)
    }
})

route.post('/login', async (req, res) => {
    let find = await Users.findOne({username: req.body.username});

    try{
        if(!find){
            res.status(404).send({
                status: false,
                message: "User not found"
            })
            return
        }

        let compare = await hash.compare(req.body.password, find.password);
        let auth = jwt.sign({_id: find._id.toString()}, process.env.TOKEN_SECRET, { expiresIn: '2m' })

        if(compare === false){
            res.status(401).send({
                status: false,
                message: "fail authorization"
            })
            return
        }else{
            res.status(200).send({
                status: compare,
                message: 'success authorization',
                auth: auth
            })
            return
        }
    }catch(err){
        res.status(400).send({
            status: false, 
            message: err.message
        })
        return
    }
})

route.get("/get-lesson", auth, async(req, res) => {
    let lesson_list = await Lesson.find({});
    try{
        res.status(200).send({
            status: true,
            message: lesson_list
        })
        return
    }catch(e){
        res.status(400).send({
            status:false,
            message: e.message
        })
        return
    }
})

route.get('/paginate', auth, async(req, res) => {
    try{
        await req.user.populate({
            path: 'lessons',
            match: {
                sks: req.query.sks
            },
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort: {
                    code: -1
                }
            }
        })
        res.status(200).send(req.user.lessons)
    }catch(e){
        res.status(400).send({
            status:false,
            message:e.message
        })
    }
})

route.get('/filter-lesson', auth, async(req, res) => {

    try{
        let y = await Lesson.find({}).where({user_id:{_id:mongoose.Types.ObjectId(req.user.id)}})
        
        res.status(200).send({
            status:true,
            message: y
        })
        return
    }catch(e){
        res.status(400).send({
            status:false,
            message:e.message
        })
    }
})

route.get("/list", auth,async (req, res) => {
    let getting = await Users.find({});
    try{
        res.status(200).send({
            status: true,
            message: getting
        })
        return
    }catch(err){
        res.status(404).send({
            status: false,
            message: err
        })
        return
    }
})

route.patch("/update/me", auth,async (req, res) => {
    try{
        req.user.update(req.body)
        res.status(200).send(varDel)
        return
    }catch(err){
        res.status(400).send({
            status:false,
            message: err.message
        })
        return
    }
})

route.delete("/del/:id",auth,async (req, res) => {
    let varDel = await Users.findByIdAndDelete(req.params.id);
    try{
        if(!varDel){
            res.status(404).send({
                status: false,
                message: "not found"
            })
        }
        res.status(200).send(varDel)
        return
    }catch(err){
        res.status(400).send({
            status:false,
            message: err.message
        })
        return
    }
})

module.exports = route;