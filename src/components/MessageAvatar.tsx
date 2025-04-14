
import { Plane, User } from "lucide-react";

const MessageAvatar = ({ isAssistant }: { isAssistant: boolean }) => {
  if (isAssistant) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-skysettle-primary text-white">
        <Plane className="h-4 w-4 rotate-45" />
      </div>
    );
  }
  
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-skysettle-secondary text-white">
      <User className="h-4 w-4" />
    </div>
  );
};

export default MessageAvatar;
