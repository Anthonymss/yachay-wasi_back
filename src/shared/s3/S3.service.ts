import {
    Injectable,
    BadRequestException,
    InternalServerErrorException,
  } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
  import { randomUUID } from 'crypto';
  import { extname } from 'path';
  
  @Injectable()
  export class S3Service {
    private s3: S3Client;
    private bucket: string;
  
    constructor(private readonly configService: ConfigService) {
        const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
        const region = this.configService.get<string>('AWS_REGION');
        const bucket = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    
        if (!accessKeyId || !secretAccessKey || !region || !bucket) {
          throw new Error('Faltan variables de entorno para configuración de AWS S3');
        }
    
        this.bucket = bucket;
    
        this.s3 = new S3Client({
          region,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
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
  
      const folder = this.getFolderByMime(file.mimetype);
      const extension = extname(file.originalname);
      const key = `${folder}/${randomUUID()}${extension}`;
  
      try {
        await this.s3.send(
          new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
          }),
        );
  
        return `https://${this.bucket}.s3.amazonaws.com/${key}`;
      } catch (error) {
        console.error('[S3] Error de subida:', error);
        throw new InternalServerErrorException('Fallo la subida a S3');
      }
    }
  
    private getFolderByMime(mimetype: string): string {
      if (mimetype.startsWith('image/')) return 'yw/images';
      if (mimetype.startsWith('video/')) return 'yw/videos';
      return 'yw/documents';
    }
  }
  