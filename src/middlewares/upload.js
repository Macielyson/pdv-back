import multer from 'multer';
import path from 'path';

// Configurar destino e nome do arquivo
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join('src', 'uploads')); // usar caminho correto
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });
export default upload;
