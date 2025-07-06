import { Test, TestingModule } from '@nestjs/testing';
import { S3Service } from '../../../src/shared/s3/S3.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Express } from 'express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

describe('S3Service', () => {
    let service: S3Service;
    let configService: any;
  
    const mockFile = {
      fieldname: 'file',
      originalname: 'test.pdf',
      encoding: '7bit',
      mimetype: 'application/pdf',
      buffer: Buffer.from('test content'),
      size: 100
    } as Express.Multer.File;
  
    const mockInvalidFile = {
      fieldname: 'file',
      originalname: 'test.exe',
      encoding: '7bit',
      mimetype: 'application/octet-stream',
      buffer: Buffer.from('test content'),
      size: 100
    } as Express.Multer.File;
  
    beforeEach(async () => {
      configService = {
        get: jest.fn()
      };
  
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          S3Service,
          { provide: ConfigService, useValue: configService }
        ],
      }).compile();
  
      service = module.get<S3Service>(S3Service);
    });
  
    describe('constructor', () => {
      it('should throw error if AWS environment variables are missing', () => {
        configService.get.mockImplementation((key: string) => {
          if (key.startsWith('AWS_')) return undefined;
          return 'test';
        });
  
        expect(() => new S3Service(configService)).toThrow('Faltan variables de entorno para configuración de AWS S3');
      });
  
      it('should initialize S3 client with valid configuration', () => {
        configService.get.mockImplementation((key: string) => {
          const values = {
            'AWS_ACCESS_KEY_ID': 'test-key',
            'AWS_SECRET_ACCESS_KEY': 'test-secret',
            'AWS_REGION': 'us-east-1',
            'AWS_S3_BUCKET_NAME': 'test-bucket'
          };
          return values[key];
        });
  
        const service = new S3Service(configService);
        expect(service).toBeDefined();
      });
    });
  
    describe('uploadFile', () => {
      it('should upload valid file successfully', async () => {
        configService.get.mockImplementation((key: string) => {
          const values = {
            'AWS_ACCESS_KEY_ID': 'test-key',
            'AWS_SECRET_ACCESS_KEY': 'test-secret',
            'AWS_REGION': 'us-east-1',
            'AWS_S3_BUCKET_NAME': 'test-bucket'
          };
          return values[key];
        });
  
        const s3Mock = {
          send: jest.fn().mockResolvedValue({})
        };
  
        jest.spyOn(S3Client.prototype, 'send').mockImplementation(() => s3Mock.send);
  
        const result = await service.uploadFile(mockFile);
        expect(result).toBeDefined();
        expect(result).toContain('test.pdf');
      });
  
      it('should throw BadRequestException for invalid file type', async () => {
        configService.get.mockImplementation((key: string) => {
          const values = {
            'AWS_ACCESS_KEY_ID': 'test-key',
            'AWS_SECRET_ACCESS_KEY': 'test-secret',
            'AWS_REGION': 'us-east-1',
            'AWS_S3_BUCKET_NAME': 'test-bucket'
          };
          return values[key];
        });
  
        await expect(service.uploadFile(mockInvalidFile))
          .rejects
          .toThrow(BadRequestException);
      });
  
      it('should throw InternalServerErrorException if upload fails', async () => {
        configService.get.mockImplementation((key: string) => {
          const values = {
            'AWS_ACCESS_KEY_ID': 'test-key',
            'AWS_SECRET_ACCESS_KEY': 'test-secret',
            'AWS_REGION': 'us-east-1',
            'AWS_S3_BUCKET_NAME': 'test-bucket'
          };
          return values[key];
        });
  
        const s3Mock = {
          send: jest.fn().mockRejectedValue(new Error('Upload failed'))
        };
  
        jest.spyOn(S3Client.prototype, 'send').mockImplementation(() => s3Mock.send);
  
        await expect(service.uploadFile(mockFile))
          .rejects
          .toThrow(InternalServerErrorException);
      });
    });
  });