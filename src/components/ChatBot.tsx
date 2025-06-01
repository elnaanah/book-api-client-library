
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

  const generateContextualResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Handle book search
    if (lowerMessage.includes('كتاب') || lowerMessage.includes('بحث') || lowerMessage.includes('أبحث')) {
      const searchTerm = userMessage.replace(/كتاب|بحث|أبحث|عن|في|ال/g, '').trim();
      if (searchTerm) {
        const books = await searchBooks(searchTerm);
        if (books.length > 0) {
          const booksList = books.slice(0, 3).map(book => 
            `📚 ${book.title}\n👤 المؤلف: ${book.author.name}\n💰 السعر: ${book.price} ر.س\n📂 الفئة: ${book.category.name}`
          ).join('\n\n');
          return `وجدت ${books.length} كتاب${books.length > 1 ? 'اً' : ''} يطابق بحثك:\n\n${booksList}${books.length > 3 ? '\n\nوالمزيد...' : ''}`;
        } else {
          return `عذراً، لم أجد أي كتب تطابق "${searchTerm}". يمكنك تجربة كلمات بحث مختلفة أو تصفح الفئات المتاحة.`;
        }
      }
    }

    // Handle author queries
    if (lowerMessage.includes('مؤلف') || lowerMessage.includes('كاتب')) {
      const authors = await getAuthors();
      const randomAuthors = authors.slice(0, 5);
      const authorsList = randomAuthors.map(author => `✍️ ${author.name}`).join('\n');
      return `إليك بعض المؤلفين المتاحين في مكتبتنا:\n\n${authorsList}\n\nيمكنك البحث عن أي مؤلف بالاسم للعثور على كتبه.`;
    }

    // Handle category queries
    if (lowerMessage.includes('فئة') || lowerMessage.includes('تصنيف') || lowerMessage.includes('قسم')) {
      const categories = await getCategories();
      const categoriesList = categories.map(cat => `📁 ${cat.name}`).join('\n');
      return `الفئات المتاحة في مكتبتنا:\n\n${categoriesList}\n\nيمكنك تصفح أي فئة للعثور على الكتب المناسبة.`;
    }

    // Handle price queries
    if (lowerMessage.includes('سعر') || lowerMessage.includes('تكلفة') || lowerMessage.includes('ثمن')) {
      return 'أسعار الكتب في مكتبتنا تتراوح حسب نوع الكتاب ومؤلفه. يمكنك استخدام فلتر السعر في الصفحة الرئيسية لتحديد نطاق سعري معين، أو اسألني عن كتاب محدد لمعرفة سعره.';
    }

    // Handle help queries
    if (lowerMessage.includes('مساعدة') || lowerMessage.includes('ساعد') || lowerMessage.includes('كيف')) {
      return 'يمكنني مساعدتك في:\n\n🔍 البحث عن الكتب\n👤 معرفة معلومات المؤلفين\n📚 تصفح الفئات المختلفة\n💰 الاستفسار عن الأسعار\n🛒 شرح كيفية إتمام عملية الشراء\n\nما الذي تود معرفته؟';
    }

    // Handle ordering queries
    if (lowerMessage.includes('طلب') || lowerMessage.includes('شراء') || lowerMessage.includes('سلة')) {
      return 'لإتمام عملية الشراء:\n\n1️⃣ أضف الكتب المرغوبة إلى السلة بالنقر على "إضافة إلى السلة"\n2️⃣ انقر على أيقونة السلة في الأعلى\n3️⃣ راجع طلبك وأدخل اسمك\n4️⃣ اضغط "إرسال الطلب"\n\nسيتم مراجعة طلبك والرد عليك قريباً!';
    }

    // Default response
    return 'شكراً لك على سؤالك! يمكنني مساعدتك في البحث عن الكتب، معرفة المؤلفين، أو تصفح الفئات. يمكنك أيضاً أن تسألني "مساعدة" لمعرفة كل ما يمكنني فعله لك.';
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
