import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
@Injectable()
export class ImagesService {
  constructor(private prisma: PrismaService) {}

  // 🔥 API 1: Lấy danh sách ảnh
  async findAll() {
    return this.prisma.hinh_anh.findMany();
  }

  // 🔥 API 2: Tìm kiếm ảnh theo tên
  async searchByName(name: string) {
    return this.prisma.hinh_anh.findMany({
      where: {
        ten_hinh: {
          contains: name.toLowerCase(), // Chuyển thành chữ thường trước khi tìm
        },
      },
    });
  }
  async getImageById(id: number) {
    return this.prisma.hinh_anh.findUnique({
      where: { hinh_id: id },
      include: {
        nguoi_dung: true, // Lấy luôn thông tin người tạo ảnh
      },
    });
  }
  async getCommentsByImageId(hinh_id: number) {
    return this.prisma.binh_luan.findMany({
      where: { hinh_id },
      include: { nguoi_dung: true }, // Lấy thông tin user bình luận
    });
  }
  async isImageSaved(hinh_id: number, nguoi_dung_id: number) {
    const savedImage = await this.prisma.luu_anh.findFirst({
      where: { hinh_id, nguoi_dung_id },
    });
    return savedImage ? true : false;
  }
  async postComment(data: { hinh_id: number; nguoi_dung_id: number; noi_dung: string }) {
    try {
      const createData: any = {
        noi_dung: data.noi_dung,
        ngay_binh_luan: new Date(),
      };
  
      if (data.hinh_id) {
        createData.hinh_anh = { connect: { hinh_id: data.hinh_id } };
      }
  
      if (data.nguoi_dung_id) {
        createData.nguoi_dung = { connect: { nguoi_dung_id: data.nguoi_dung_id } };
      }
  
      return await this.prisma.binh_luan.create({
        data: createData,
      });
    } catch (error) {
      console.error("Lỗi khi tạo bình luận:", error);
      throw new HttpException(
        { status: 500, message: "Lỗi server: " + error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
 // 🔥 Xóa ảnh đã tạo theo id ảnh

 async deleteImage(imageId: number, userId: number) {
   try {
     // Kiểm tra ảnh có tồn tại không
     const image = await this.prisma.hinh_anh.findFirst({
       where: { hinh_id: imageId, nguoi_dung_id: userId },
     });

     if (!image) {
       throw new HttpException('Image not found or unauthorized', HttpStatus.NOT_FOUND);
     }

     // Xóa ảnh
     return this.prisma.hinh_anh.delete({
       where: { hinh_id: imageId },
     });
   } catch (error) {
     console.error('Error in deleteImage:', error);
     throw new HttpException(
       `Internal server error: ${error.message}`,
       HttpStatus.INTERNAL_SERVER_ERROR,
     );
   }
 }

 // 🔥 Thêm một ảnh mới của user
 async createImage(createImageDto: CreateImageDto, userId: number) {
   try {
     // Kiểm tra user có tồn tại không
     const user = await this.prisma.nguoi_dung.findUnique({
       where: { nguoi_dung_id: userId },
     });

     if (!user) {
       throw new HttpException('User not found', HttpStatus.NOT_FOUND);
     }

     // Tìm giá trị hinh_id lớn nhất hiện tại
     const maxImage = await this.prisma.hinh_anh.findFirst({
       orderBy: { hinh_id: 'desc' },
       select: { hinh_id: true },
     });

     // Tạo hinh_id mới (tăng giá trị lớn nhất lên 1)
     const newHinhId = maxImage ? maxImage.hinh_id + 1 : 1;

     // Tạo ảnh mới
     return await this.prisma.hinh_anh.create({
       data: {
         hinh_id: newHinhId, // Cung cấp hinh_id
         ten_hinh: createImageDto.ten_hinh,
         duong_dan: createImageDto.duong_dan,
         mo_ta: createImageDto.mo_ta,
         nguoi_dung_id: userId, // Gán trực tiếp nguoi_dung_id
       },
     });
   } catch (error) {
     console.error('Error in createImage:', error);
     throw new HttpException(
       `Internal server error: ${error.message}`,
       HttpStatus.INTERNAL_SERVER_ERROR,
     );
   }
 }
  
  
}
