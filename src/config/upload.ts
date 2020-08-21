import path from 'path'
import crypto from 'crypto'
import multer from 'multer'

const tmpProfile = path.resolve(__dirname, '..', '..', 'tmp', 'profiles');

export default {
    directory: tmpProfile,
    storage: multer.diskStorage({
        destination: tmpProfile,
        filename(request, file, callback) {
            const fileHash = crypto.randomBytes(10).toString('hex');
            const fileName = `${fileHash}-${file.originalname}`;

            return callback(null, fileName);
        }
    })
}