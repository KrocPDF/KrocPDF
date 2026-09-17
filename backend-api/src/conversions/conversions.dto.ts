import { 
  IsEnum, 
  IsInt, 
  IsOptional, 
  IsString, 
  IsArray, 
  ValidateNested, 
  Min, 
  Max, 
  IsIn,
  registerDecorator,
  ValidationOptions,
  ValidationArguments
} from 'class-validator';
import { Type } from 'class-transformer';
import { PageSize, PageOrientation, PageMargin, JobType, CompressionLevel } from '@prisma/client';

export function ValidateFilesMimeType(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'validateFilesMimeType',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const dto = args.object as InitiateConversionDto;
          const files = value as FileDto[];
          if (!files || !Array.isArray(files)) return false;
          
          const jobType = dto.jobType || JobType.IMAGE_TO_PDF;
          if ((jobType === JobType.COMPRESS_PDF || jobType === JobType.PDF_TO_JPG) && files.length !== 1) {
            return false;
          }
          for (const file of files) {
            if (jobType === JobType.IMAGE_TO_PDF) {
              if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimeType)) return false;
            } else if (jobType === JobType.MERGE_PDF || jobType === JobType.COMPRESS_PDF || jobType === JobType.PDF_TO_JPG) {
              if (file.mimeType !== 'application/pdf') return false;
            }
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const dto = args.object as InitiateConversionDto;
          const files = (args.value as FileDto[]) || [];
          if ((dto.jobType === JobType.COMPRESS_PDF || dto.jobType === JobType.PDF_TO_JPG) && files.length !== 1) {
            return `${dto.jobType} requires exactly 1 PDF file`;
          }
          if (dto.jobType === JobType.MERGE_PDF || dto.jobType === JobType.COMPRESS_PDF || dto.jobType === JobType.PDF_TO_JPG) {
            return 'All files must be application/pdf for this job type';
          }
          return 'All files must be valid images (jpeg, png, webp) for IMAGE_TO_PDF jobs';
        }
      },
    });
  };
}

export class ConversionSettingsDto {
  @IsEnum(PageSize)
  @IsOptional()
  pageSize?: PageSize;

  @IsEnum(PageOrientation)
  @IsOptional()
  orientation?: PageOrientation;

  @IsEnum(PageMargin)
  @IsOptional()
  margins?: PageMargin;

  @IsInt()
  @IsOptional()
  dpi?: number;

  @IsString()
  @IsIn(['flatten_white', 'flatten_black', 'keep_transparent'])
  @IsOptional()
  transparencyMode?: string;

  @IsEnum(CompressionLevel)
  @IsOptional()
  compressionLevel?: CompressionLevel;

  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  imageQuality?: number;
}

export class FileDto {
  @IsString()
  fileName: string;

  @IsString()
  mimeType: string;

  @IsInt()
  @Min(1)
  @Max(104857600) // 100MB limit
  sizeBytes: number;
}

export class InitiateConversionDto {
  @IsEnum(JobType)
  @IsOptional()
  jobType?: JobType;

  @ValidateNested()
  @Type(() => ConversionSettingsDto)
  @IsOptional()
  settings?: ConversionSettingsDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  @ValidateFilesMimeType()
  files: FileDto[];
}
