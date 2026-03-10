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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveOnboardingDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class SaveOnboardingDto {
    level;
    goals;
    studyTime;
    area;
    challenges;
}
exports.SaveOnboardingDto = SaveOnboardingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'intermediate' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SaveOnboardingDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['career', 'analysis'] }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], SaveOnboardingDto.prototype, "goals", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], SaveOnboardingDto.prototype, "studyTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'financial' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SaveOnboardingDto.prototype, "area", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['formulas', 'pivot'] }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], SaveOnboardingDto.prototype, "challenges", void 0);
//# sourceMappingURL=save-onboarding.dto.js.map