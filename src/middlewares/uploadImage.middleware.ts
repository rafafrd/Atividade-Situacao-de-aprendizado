import createMulter from "../config/produto.multer";

const uploadImage = createMulter ({
    folder: 'Images',
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    fileSize: 10 * 1024 * 1024
}).single('vinculoImagem');

export default uploadImage