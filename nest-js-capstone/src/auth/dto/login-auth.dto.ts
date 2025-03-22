import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({ example: 'string', description: 'Email của người dùng' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'string', description: 'Mật khẩu của người dùng' })
  @IsNotEmpty()
  @MinLength(6)
  mat_khau: string;
}
