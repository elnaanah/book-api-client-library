
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';
import { apiService } from '@/services/api';
import { Book, Author, Category } from '@/types/api';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'مرحباً! أنا مساعدك الذكي في مكتبة الكتب. يمكنني مساعدتك في العثور على الكتب، معرفة تفاصيل المؤلفين، أو الإجابة على أي استفسارات حول المتجر. كيف يمكنني مساعدتك اليوم؟',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const searchBooks = async (query: string): Promise<Book[]> => {
    try {
      return await apiService.getBooks({ search: query });
    } catch (error) {
      console.error('Error searching books:', error);
      return [];
    }
  };

  const getAuthors = async (): Promise<Author[]> => {
    try {
      return await apiService.getAuthors();
    } catch (error) {
      console.error('Error fetching authors:', error);
      return [];
    }
  };

  const getCategories = async (): Promise<Category[]> => {
    try {
      return await apiService.getCategories();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  };

  const callOpenRouter = async (userMessage: string, context: string): Promise<string> => {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'مكتبة الكتب - مساعد ذكي'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.1-8b-instruct:free',
          messages: [
            {
              role: 'system',
              content: `أنت مساعد ذكي لمكتبة إلكترونية تبيع الكتب العربية. مهمتك مساعدة العملاء في:
1. البحث عن الكتب والمؤلفين
2. تقديم معلومات عن الأسعار والفئات
3. شرح عملية الشراء
4. الإجابة على الاستفسارات العامة

يجب أن تكون إجاباتك باللغة العربية، مفيدة، ومختصرة. استخدم المعلومات المتاحة من قاعدة البيانات عند الإجابة.

البيانات المتاحة:
${context}`
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: 300,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'عذراً، لم أتمكن من معالجة طلبك. يرجى المحاولة مرة أخرى.';
    } catch (error) {
      console.error('Error calling OpenRouter:', error);
      return 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.';
    }
  };

  const generateContextualResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase();
    let context = '';
    
    // Gather relevant context based on user message
    if (lowerMessage.includes('كتاب') || lowerMessage.includes('بحث') || lowerMessage.includes('أبحث')) {
      const searchTerm = userMessage.replace(/كتاب|بحث|أبحث|عن|في|ال/g, '').trim();
      if (searchTerm) {
        const books = await searchBooks(searchTerm);
        if (books.length > 0) {
          context += `الكتب المتاحة التي تطابق البحث:\n`;
          books.slice(0, 5).forEach(book => {
            context += `- ${book.title} بواسطة ${book.author.name} - السعر: ${book.price} ر.س\n`;
          });
        }
      }
    }

    if (lowerMessage.includes('مؤلف') || lowerMessage.includes('كاتب')) {
      const authors = await getAuthors();
      context += `المؤلفون المتاحون:\n`;
      authors.slice(0, 10).forEach(author => {
        context += `- ${author.name}\n`;
      });
    }

    if (lowerMessage.includes('فئة') || lowerMessage.includes('تصنيف')) {
      const categories = await getCategories();
      context += `الفئات المتاحة:\n`;
      categories.forEach(category => {
        context += `- ${category.name}\n`;
      });
    }

    // Use OpenRouter API for intelligent response
    return await callOpenRouter(userMessage, context);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const responseContent = await generateContextualResponse(inputValue.trim());
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed bottom-20 right-4 w-80 h-96 flex flex-col shadow-xl z-50 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-library-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2 space-x-reverse">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-library-700 text-white">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <h3 className="font-semibold">مساعد مكتبة الكتب</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-library-700">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 space-x-reverse max-w-[80%]`}>
                {!message.isUser && (
                  <Avatar className="h-6 w-6 mt-1">
                    <AvatarFallback className="bg-library-100 text-library-600">
                      <Bot className="h-3 w-3" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`p-3 rounded-lg whitespace-pre-line ${
                    message.isUser
                      ? 'bg-library-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                {message.isUser && (
                  <Avatar className="h-6 w-6 mt-1">
                    <AvatarFallback className="bg-library-600 text-white">
                      <User className="h-3 w-3" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-library-100 text-library-600">
                    <Bot className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2 space-x-reverse">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="اكتب رسالتك..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            size="icon"
            className="bg-library-600 hover:bg-library-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatBot;
