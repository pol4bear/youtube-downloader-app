interface Message {
  no: number;
  sender?: string;
  receiver?: string;
  time: Date;
  title: string;
  content: string;
}

export interface MessageResult {
  count: number;
  messages: Message[];
}

export default Message;