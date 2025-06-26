import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp',
      'video/mp4',
      'video/mpeg',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Formato de archivo no permitido');
    }

    const resourceType = this.getResourceType(file.mimetype);
    const folderPath = this.getFolderPath(resourceType);
    const uploadPreset =
      this.configService.get<string>('CLOUDINARY_UPLOAD_PRESET') ||
      'public_raw_upload';

    try {
      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: resourceType,
            folder: folderPath,
            public_id: file.originalname.replace(/\.[^/.]+$/, ''),
            format: this.getFileExtension(file.originalname),
            upload_preset: uploadPreset,
            use_filename: true,
            unique_filename: false,
            overwrite: true,
          },
          (error, result) => {
            if (error || !result) {
              console.error('[Cloudinary] Error de subida:', error);
              return reject(
                new InternalServerErrorException(
                  'Fallo la subida a Cloudinary',
                ),
              );
            }
            resolve(result);
          },
        );

        toStream(file.buffer).pipe(uploadStream);
      });

      return result.secure_url;
    } catch (error) {
      console.error('[Cloudinary] Excepción durante la subida:', error);
      throw new InternalServerErrorException('Fallo la subida a Cloudinary');
    }
  }

  private getResourceType(mimetype: string): 'image' | 'video' | 'raw' {
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype.startsWith('video/')) return 'video';
    return 'raw';
  }

  private getFolderPath(resourceType: string): string {
    switch (resourceType) {
      case 'image':
        return 'yw/images';
      case 'video':
        return 'yw/videos';
      case 'raw':
        return 'yw/documents';
      default:
        return 'yw/others';
    }
  }

  private getFileExtension(filename: string): string {
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop() || '' : '';
  }
}
