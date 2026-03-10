import { ChatService } from './chat.service';
import { ChatMessageDto } from './dto/chat.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class ChatController {
    private readonly chatService;
    private readonly prisma;
    constructor(chatService: ChatService, prisma: PrismaService);
    sendMessage(req: any, chatMessageDto: ChatMessageDto): Promise<{
        response: string;
    }>;
}
