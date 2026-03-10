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
exports.TrailsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const trails_service_1 = require("./trails.service");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const submit_answer_dto_1 = require("./dto/submit-answer.dto");
let TrailsController = class TrailsController {
    trailsService;
    constructor(trailsService) {
        this.trailsService = trailsService;
    }
    findAll(user) {
        return this.trailsService.findAllWithProgress(user.id);
    }
    findOne(slug, user) {
        return this.trailsService.findOneWithQuestions(slug, user.id);
    }
    getQuestion(slug, order, user) {
        return this.trailsService.getQuestion(slug, parseInt(order), user.id);
    }
    submitAnswer(user, dto) {
        return this.trailsService.submitAnswer(user.id, dto.questionId, dto.value, dto.timeSpentMs ?? 0);
    }
};
exports.TrailsController = TrailsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TrailsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':slug'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TrailsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':slug/questions/:order'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Param)('order')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], TrailsController.prototype, "getQuestion", null);
__decorate([
    (0, common_1.Post)('answer'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, submit_answer_dto_1.SubmitAnswerDto]),
    __metadata("design:returntype", void 0)
], TrailsController.prototype, "submitAnswer", null);
exports.TrailsController = TrailsController = __decorate([
    (0, swagger_1.ApiTags)('Trails'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('trails'),
    __metadata("design:paramtypes", [trails_service_1.TrailsService])
], TrailsController);
//# sourceMappingURL=trails.controller.js.map