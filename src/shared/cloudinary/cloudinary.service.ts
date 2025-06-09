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

    try {
      console.log(`[Cloudinary] Starting upload to ${folderPath} as ${resourceType}...`);

      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: resourceType,
            folder: folderPath,
            public_id: file.originalname.split('.')[0],
          },
          (error, result) => {
            if (error || !result) {
              console.error('[Cloudinary] Upload error:', error);
              return reject(
                new InternalServerErrorException('Fallo la subida a Cloudinary'),
              );
            }
            console.log('[Cloudinary] Upload successful:', result.secure_url);
            resolve(result);
          },
        );

        toStream(file.buffer).pipe(uploadStream);
      });

      return result.secure_url;
    } catch (error) {
      console.error('[Cloudinary] Exception during upload:', error);
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
}
