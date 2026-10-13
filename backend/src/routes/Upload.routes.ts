import { randomUUID } from 'crypto';
import { mkdirSync } from 'fs';
import path from 'path';
import { Router } from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth.middleware';

const uploadRoute = Router();
const uploadsDirectory = path.resolve(__dirname, '../../uploads');
const extensions: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

const uploader = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => {
      try {
        mkdirSync(uploadsDirectory, { recursive: true });
        callback(null, uploadsDirectory);
      } catch (error) {
        callback(error as Error, uploadsDirectory);
      }
    },
    filename: (_req, file, callback) => {
      callback(null, `${randomUUID()}${extensions[file.mimetype]}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!extensions[file.mimetype]) {
      callback(new Error('Formato inválido. Envie JPEG, PNG, WEBP ou GIF.'));
      return;
    }
    callback(null, true);
  },
});

uploadRoute.post('/', authMiddleware, (req, res) => {
  uploader.single('imagem')(req, res, error => {
    if (error) {
      const status = error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
      return res.status(status).json({ message: error.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Envie um arquivo no campo imagem.' });
    }
    return res.status(201).json({ url: `/uploads/${req.file.filename}` });
  });
});

export default uploadRoute;
