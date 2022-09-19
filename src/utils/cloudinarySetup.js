import pkg from 'cloudinary'
import multerStorageCloudinary from 'multer-storage-cloudinary'

const {v2:cloudinary} = pkg
const {CloudinaryStorage} = multerStorageCloudinary

export const saveToUsers = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: 'ivis/users'
    }
})
export const saveToMedia = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: 'ivis/media'
    }
})