import { PartialType } from '@nestjs/swagger';
import { RegisterAuthDto } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(RegisterAuthDto) {}
