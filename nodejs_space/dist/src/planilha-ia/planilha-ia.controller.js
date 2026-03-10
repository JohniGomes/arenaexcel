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
exports.PlanilhaIAController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const planilha_ia_service_1 = require("./planilha-ia.service");
let PlanilhaIAController = class PlanilhaIAController {
    service;
    constructor(service) {
        this.service = service;
    }
    async analisar(req, body) {
        return this.service.analisar(req.user.id, body.dados, body.nomeArquivo);
    }
    async chat(req, body) {
        return this.service.chat(req.user.id, body.dados, body.mensagens);
    }
    async extrairImagem(req, body) {
        return this.service.extrairDaImagem(req.user.id, body.base64);
    }
};
exports.PlanilhaIAController = PlanilhaIAController;
__decorate([
    (0, common_1.Post)('analisar'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PlanilhaIAController.prototype, "analisar", null);
__decorate([
    (0, common_1.Post)('chat'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PlanilhaIAController.prototype, "chat", null);
__decorate([
    (0, common_1.Post)('extrair-imagem'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PlanilhaIAController.prototype, "extrairImagem", null);
exports.PlanilhaIAController = PlanilhaIAController = __decorate([
    (0, common_1.Controller)('api/planilha-ia'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [planilha_ia_service_1.PlanilhaIAService])
], PlanilhaIAController);
//# sourceMappingURL=planilha-ia.controller.js.map