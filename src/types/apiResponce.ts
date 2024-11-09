import { Message } from "@/model/User";

export interface apiResponse {
  success: boolean;
  message: string;
  isAcceptingMessage?: boolean;
  messages?: Array<Message>;
}
