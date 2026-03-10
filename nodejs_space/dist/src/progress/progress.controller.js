"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const progress_service_1 = require("./progress.service");
const update_lesson_dto_1 = require("./dto/update-lesson.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
let ProgressController = class ProgressController {
    progressService;
    constructor(progressService) {
        this.progressService = progressService;
    }
    async getProgress(user) {
        return this.progressService.getProgress(user.id);
    }
    async updateLesson(user, updateLessonDto) {
        return this.progressService.updateLesson(user.id, updateLessonDto);
    }
};
exports.ProgressController = ProgressController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user progress across all levels' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Progress retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProgressController.prototype, "getProgress", null);
__decorate([
    (0, common_1.Post)('lesson'),
    (0, swagger_1.ApiOperation)({ summary: 'Update lesson completion status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lesson progress updated' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_lesson_dto_1.UpdateLessonDto]),
    __metadata("design:returntype", Promise)
], ProgressController.prototype, "updateLesson", null);
exports.ProgressController = ProgressController = __decorate([
    (0, swagger_1.ApiTags)('Progress'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('api/progress'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [progress_service_1.ProgressService])
], ProgressController);
//# sourceMappingURL=progress.controller.js.map