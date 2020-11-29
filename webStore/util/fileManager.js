const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination:(req, file, cb) =>{
        cb(null, `${path.join('public', 'images')}`);
    },
    filename:(req, file, cb) =>{
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) =>{
    if(path.extname(file.originalname) == '.png' ||
        path.extname(file.originalname) == '.jpg'||
        path.extname(file.originalname) == '.jpeg'
    ){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
    
}

const upload = multer({
    storage:storage,
    fileFilter:fileFilter
})


module.exports = upload;