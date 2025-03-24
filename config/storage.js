const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 3 * 1024 * 1024
    },
    fileFilter: function(req, file, cb) {
        if(!file.mimetype.startsWith('image/')) {
            return cb(new Error('Le fichier n\'est pas une image'));
        }
        cb(null, true);
    }
});

module.exports = upload;