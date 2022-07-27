const {mongoose, Schema} = require('mongoose');
const validator = require('validator')
const multer = require('multer')

mongoose.connect('mongodb://127.0.0.1:27017/expressAPI', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected')).catch(err=>console.log(err.message))

const lessonSchema = new Schema({
    code: {type: String, required:true,trim:true},
    lesson: {type: String, required: true,trim:true},
    sks: {
        type:Number,
        default:0,
        min: 1,
        max: [6, 'SKS boundary 4'],
        validate: {
            validator: (v) => {
                return v < 5
            },
            message: props => `${props.value} SKS boundary is 4`
        }
    },
    user_id: {type:mongoose.Schema.Types.ObjectId, required:true, trim:true, ref:'User'}
})

const Lesson = mongoose.model('lesson', lessonSchema);

let userSchema = new Schema({
    nim: {type: Number, required: true,trim:true},
    email: {
        type: String, 
        required: true,
        trim:true,
        validate:{
            validator: (v) => {
                return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(v)
            }
        }
    },
    username: {
        type: String, 
        required: true,
        trim:true, 
        minlength: 6,
        validate: {
            validator: (v) => {
                return v.length > 6
            },
            message: props => 'Length dont more than 6'
        }
    },
    password: {type: String, required: true,trim:true, minlength: 8},
    date: { type: Date, default: Date.now },
    profile: {
        type: Buffer
    }
})

const Users = mongoose.model('User', userSchema)

userSchema.virtual('lessons', {
    ref: 'lesson',
    localField: '_id',
    foreignField: 'user_id'
})

const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 100000
    },
    fileFilter: (req, file, cb) => {
        if(!file.originalname.match(/\.jpg$/)){
            return cb(new Error('File must be jpg'))
        }
        cb(undefined, true)
    }
})

module.exports = { Lesson, Users, upload };