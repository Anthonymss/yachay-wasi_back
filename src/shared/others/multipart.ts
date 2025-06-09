import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { MultipartFile } from '@fastify/multipart';
import { CreateVolunteerDto } from 'src/modules/volunteer/dto/create-volunteer.dto';
export interface UploadedFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  fieldname: string;
  size: number;
  encoding?: string;
}
export async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

export async function parseMultipart(
  parts: AsyncIterableIterator<MultipartFile | any>,
): Promise<{ dto: CreateVolunteerDto; file: UploadedFile }> {
  const body: Record<string, any> = {};
  let fileBuffer: Buffer | null = null;
  let fileMeta: Partial<UploadedFile> = {};

  for await (const part of parts) {
    if (part.type === 'file' && part.fieldname === 'cv') {
      fileBuffer = await streamToBuffer(part.file);
      fileMeta = {
        mimetype: part.mimetype,
        originalname: part.filename,
        fieldname: part.fieldname,
        size: part.file.truncated ? 0 : fileBuffer.length,
        encoding: part.encoding ?? '',
      };
    } else if (part.type === 'field') {
      body[part.fieldname] = part.value;
    }
  }

  if (!fileBuffer) {
    throw new BadRequestException('CV file is required');
  }

  const file: UploadedFile = {
    ...fileMeta,
    buffer: fileBuffer,
  } as UploadedFile;

  if (file.mimetype !== 'application/pdf') {
    throw new BadRequestException('Solo se permiten archivos PDF');
  }

  const dto = plainToInstance(CreateVolunteerDto, body, {
    enableImplicitConversion: true,
  });

  const errors = await validate(dto);
  if (errors.length > 0) {
    throw new BadRequestException(errors);
  }

  return { dto, file };
}
