declare class HistoryMessageDto {
    role: 'user' | 'assistant';
    content: string;
}
export declare class ChatMessageDto {
    message: string;
    history?: HistoryMessageDto[];
}
export {};
