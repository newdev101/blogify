const multer = require('multer');
const path = require('path');



// multer storage
const storage = multer.diskStorage({
     destination: function (req, file, cb) {
       cb(null, path.resolve(`./public/uploads/`));
     },
     filename: function (req, file, cb) {
        const sanitized = file.originalname.replace(/\s+/g, '-');

       const fileName = `${Date.now()}-${sanitized}`;
       cb(null, fileName);
     },
   });

const upload = multer({ storage: storage })

module.exports = upload;
