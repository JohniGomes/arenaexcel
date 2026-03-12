import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get('certificate-data')
  @ApiOperation({ summary: 'Get certificate data' })
  @ApiResponse({ status: 200, description: 'Certificate data retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCertificateData(@Request() req: any) {
    return this.userService.getCertificateData(req.user.id ?? req.user.userId);
  }
}
