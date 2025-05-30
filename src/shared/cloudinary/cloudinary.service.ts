import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
export enum CloudinaryFolder {
  FOLDER_USER = 'folder_user',
  FOLDER_SPACES = 'folder_spaces',
}
@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }
  async uploadImageToUserFolder(file: Express.Multer.File): Promise<string> {
    return this.uploadImage(file, CloudinaryFolder.FOLDER_USER);
  }
  async uploadImageToSpacesFolder(file: Express.Multer.File): Promise<string> {
    return this.uploadImage(file, CloudinaryFolder.FOLDER_SPACES);
  }

  private async uploadImage(
    file: Express.Multer.File,
    folderPath: string,
  ): Promise<string> {
    const allowedFormats = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp',
    ];
    if (!allowedFormats.includes(file.mimetype))
      throw new BadRequestException('Invalid file format');
    //if (file.size > 5 * 1024 * 1024) throw new BadRequestException('File size exceeds 5MB');restriccion
    try {
      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto', folder: folderPath },
          (error, result) => {
            if (error || !result)
              return reject(
                new InternalServerErrorException('Cloudinary upload failed'),
              );
            resolve(result);
          },
        );
        uploadStream.end(file.buffer);
      });
      return result.secure_url;
    } catch (error) {
      throw new InternalServerErrorException('Cloudinary upload failed');
    }
  }
}
