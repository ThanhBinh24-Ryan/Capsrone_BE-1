import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(loginDto: LoginAuthDto) {
    const { email, mat_khau } = loginDto;

    const user = await this.prisma.nguoi_dung.findFirst({
      where: { email: email }, // Sửa lỗi thiếu email
    });
    


    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    if (!user || !user.mat_khau) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }
    
    const isPasswordValid = await bcrypt.compare(mat_khau, user.mat_khau);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }
    
    // 🔥 Tạo token JWT
    const token = this.jwtService.sign({ userId: user.nguoi_dung_id, email: user.email });

    return { message: 'Đăng nhập thành công', token };
  }

  async register(registerDto: RegisterAuthDto) {
    const { email, mat_khau, ho_ten } = registerDto;

    // 🛡️ Check xem email đã tồn tại
    const existingUser = await this.prisma.nguoi_dung.findFirst({ where: { email } });
    if (existingUser) throw new BadRequestException('Email đã tồn tại!');

    // 🔐 Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(mat_khau, 10);

    // 💾 Lưu vào database
    const newUser = await this.prisma.nguoi_dung.create({
      data: {
        email,
        mat_khau: hashedPassword,
        ho_ten,
      },
    });

    return { message: 'Đăng ký thành công', userId: newUser.nguoi_dung_id };
  }
}
