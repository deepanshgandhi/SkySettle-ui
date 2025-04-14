
import MessageAvatar from './MessageAvatar';
import MessageActions from './MessageActions';

type MessageProps = {
  role: 'user' | 'assistant';
  content: string;
};

const Message = ({ role, content }: MessageProps) => {
  return (
    <div className="py-4 border-b border-skysettle-border/30 last:border-b-0">
      <div className={`flex gap-4 ${role === 'user' ? '' : ''}`}>
        <MessageAvatar isAssistant={role === 'assistant'} />
        <div className={`flex-1 space-y-2 ${role === 'user' ? '' : ''}`}>
          <div className={`${role === 'user' ? 'text-skysettle-dark' : 'text-skysettle-dark'}`}>
            {content}
          </div>
          {role === 'assistant' && <MessageActions />}
        </div>
      </div>
    </div>
  );
};

export default Message;
