import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterAuthDto {
  @ApiProperty({ example: 'user@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'string' })
  @IsNotEmpty()
  @MinLength(6)
  mat_khau: string;

  @ApiProperty({ example: 'username' })
  @IsNotEmpty()
  ho_ten: string;
}
