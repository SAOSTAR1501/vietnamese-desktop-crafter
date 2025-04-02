
import React from 'react';

interface Conversation {
  question: string;
  answer: string;
}

interface ConversationHistoryProps {
  conversations: Conversation[];
}

export const ConversationHistory = ({ conversations }: ConversationHistoryProps) => {
  return (
    <div className="bg-card p-4 rounded-lg border h-full">
      <h2 className="font-medium mb-4">Lịch sử hội thoại</h2>
      {conversations.length === 0 ? (
        <div className="text-muted-foreground text-center py-8">
          Chưa có hội thoại nào
        </div>
      ) : (
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {conversations.map((conv, idx) => (
            <div key={idx} className="border rounded-lg p-3 text-sm">
              <div className="font-medium">Q: {conv.question}</div>
              <div className="mt-2 text-muted-foreground line-clamp-3">
                A: {conv.answer}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
