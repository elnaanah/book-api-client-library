
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle } from 'lucide-react';
import ChatBot from './ChatBot';

const ChatBotFab: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(true);

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setHasNewMessage(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          onClick={handleToggleChat}
          className="h-14 w-14 rounded-full bg-library-600 hover:bg-library-700 shadow-lg transition-all duration-300 hover:scale-105"
          size="icon"
        >
          <div className="relative">
            <MessageCircle className="h-6 w-6 text-white" />
            {hasNewMessage && (
              <Badge className="absolute -top-2 -right-2 h-3 w-3 p-0 bg-red-500 border-2 border-white">
                <span className="sr-only">رسالة جديدة</span>
              </Badge>
            )}
          </div>
        </Button>
      </div>

      {/* Chat Bot Component */}
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default ChatBotFab;
