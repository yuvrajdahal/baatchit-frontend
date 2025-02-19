import { User, UserChats } from "./types";
import Api, { ApiError, asyncHandler } from "@/lib/axios";

const api = new Api();

export async function createUserChats(
  user: string,
  token: string
): Promise<{
  success: boolean;
  data: UserChats;
}> {
  return asyncHandler(() =>
    api.post<{
      success: boolean;
      data: UserChats;
    }>(
      "/chats/chat-users",
      {
        user: user,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  );
}
export async function getUserChats(token: string): Promise<{
  success: boolean;
  data: UserChats[];
}> {
  return asyncHandler(() =>
    api.get<{
      success: boolean;
      data: UserChats[];
    }>(`/chats/chat-users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  );
}
// export const getMessages = asyncHandler(async (req, res, next) => {
//   const { from, to } = req.query;
//   const messages = await Chat.find({
//     chatUsers: {
//       $all: [from, to],
//     },
//   })
//     .populate("from")
//     .populate("to")
//     .select("-cloud_id");

//   res.status(201).json({
//     success: true,
//     data: messages,
//   });
// });
export async function getUserMessages(
  from: string,
  to: string,
  token: string
): Promise<{
  success: boolean;
  data: UserChats[];
}> {
  return asyncHandler(() =>
    api.get<{
      success: boolean;
      data: UserChats[];
    }>(`/chats?from=${from}&to=${to}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  );
}
