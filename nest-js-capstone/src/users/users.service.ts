import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

 // 🔥 Lấy thông tin user hiện tại
  // 🔥 Lấy thông tin user hiện tại
  async getUserInfo(userId: number) {
    try {
      // Kiểm tra userId có hợp lệ không
      if (!userId || isNaN(userId)) {
        throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
      }

      const user = await this.prisma.nguoi_dung.findUnique({
        where: { nguoi_dung_id: userId },
        select: {
          nguoi_dung_id: true,
          email: true,
          ho_ten: true,
          tuoi: true,
        },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      console.error('Error in getUserInfo:', error);
      if (error instanceof HttpException) {
        throw error; // Ném lại lỗi đã được xử lý
      }
      throw new HttpException(
        `Internal server error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 🔥 Lấy danh sách ảnh đã lưu theo user id
  async getSavedImages(userId: number) {
    return this.prisma.luu_anh.findMany({
      where: { nguoi_dung_id: userId },
      include: {
        hinh_anh: true, // Lấy thông tin ảnh đã lưu
      },
    });
  }

  // 🔥 Lấy danh sách ảnh đã tạo theo user id
  async getCreatedImages(userId: number) {
    return this.prisma.hinh_anh.findMany({
      where: { nguoi_dung_id: userId },
      include: {
        nguoi_dung: true, // Lấy thông tin người tạo (tùy chọn)
      },
    });
  }

  // 🔥 Cập nhật thông tin cá nhân của user
  async updateUserInfo(userId: number, updateUserDto: UpdateUserDto) {
    try {
      // Truy vấn thông tin user hiện tại từ database
      const user = await this.prisma.nguoi_dung.findUnique({
        where: { nguoi_dung_id: userId },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Cập nhật thông tin với giá trị từ DTO hoặc giữ nguyên giá trị cũ
      const updatedUser = await this.prisma.nguoi_dung.update({
        where: { nguoi_dung_id: userId },
        data: {
          ho_ten: updateUserDto.ho_ten ?? user.ho_ten, // Giữ nguyên nếu không gửi
          tuoi: updateUserDto.tuoi ?? user.tuoi,       // Giữ nguyên nếu không gửi
        },
        select: {
          nguoi_dung_id: true,
          email: true,
          ho_ten: true,
          tuoi: true,
        },
      });

      return updatedUser;
    } catch (error) {
      console.error('Error in updateUserInfo:', error);
      throw new HttpException(
        `Internal server error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
}