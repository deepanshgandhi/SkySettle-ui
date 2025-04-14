
import MessageAvatar from './MessageAvatar';
import MessageActions from './MessageActions';

type MessageProps = {
  role: 'user' | 'assistant';
  content: string;
};

const Message = ({ role, content }: MessageProps) => {
  const isUser = role === 'user';
  
  return (
    <div className="py-4 border-b border-skysettle-border/30 last:border-b-0">
      <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
        <MessageAvatar isAssistant={!isUser} />
        <div className={`flex-1 space-y-2 ${isUser ? 'text-right' : ''}`}>
          <div className={`inline-block p-3 rounded-lg ${isUser ? 'bg-skysettle-primary text-white ml-auto' : 'bg-gray-100 text-skysettle-dark mr-auto'}`}>
            {content}
          </div>
          {!isUser && <MessageActions />}
        </div>
      </div>
    </div>
  );
};

export default Message;
