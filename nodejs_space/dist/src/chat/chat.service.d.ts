import { ChatMessageDto } from './dto/chat.dto';
export declare class ChatService {
    private readonly logger;
    private readonly apiKey;
    private readonly apiUrl;
    sendMessage(chatMessageDto: ChatMessageDto): Promise<{
        response: string;
    }>;
}
