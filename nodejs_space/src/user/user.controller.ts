import { Controller, Get, Put, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SaveOnboardingDto } from './dto/save-onboarding.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@ApiTags('User')
@ApiBearerAuth()
@Controller('api/user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getProfile(@CurrentUser() user: any) {
    return this.userService.getProfile(user.id);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(user.id, updateProfileDto);
  }

  @Post('onboarding')
  @ApiOperation({ summary: 'Save user onboarding preferences' })
  @ApiResponse({ status: 201, description: 'Onboarding saved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async saveOnboarding(
    @CurrentUser() user: any,
    @Body() saveOnboardingDto: SaveOnboardingDto,
  ) {
    return this.userService.saveOnboarding(user.id, saveOnboardingDto);
  }

  @Post('select-mascot')
  @ApiOperation({ summary: 'Select profile mascot' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        mascotId: {
          type: 'string',
          enum: ['professional', 'casual', 'sporty', 'studious', 'enthusiastic'],
          description: 'Mascot identifier',
        },
      },
      required: ['mascotId'],
    },
  })
  @ApiResponse({ status: 201, description: 'Mascot selected successfully' })
  @ApiResponse({ status: 400, description: 'Invalid mascot' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async selectMascot(
    @CurrentUser() user: any,
    @Body('mascotId') mascotId: string,
  ) {
    return this.userService.selectMascot(user.id, mascotId);
  }
}