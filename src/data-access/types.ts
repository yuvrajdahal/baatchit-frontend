export type User = {
  profilePicture?: string;
  username: string;
  fullname: string;
  email: string;
  emailToken?: string;
  password: string;
  isVerified: boolean;
  followers: string[];
  following: string[];
  posts?: Post[];
  _id: string;
  createdAt: Date;
  isFollowing?: boolean;
  followersCount?: number;
  followingCount?: number;
  mutualFollowers?: User[];
  mutualFollowersCount?: number;
};

export type Post = {
  _id: string;
  description: string;
  image: string;
  imageid: string;
  user: User;
  isLiked: boolean;
  likesCount: number;
  links: User[];
  comments: Comment[];
  createdAt: Date;
};
export type Comment = {
  _id: string;
  message: string;
  post: "string";
  user: User;
  createdAt: Date;
};
export type UserChats = {
  _id: string;
  receiver: User;
  sender: User;
  createdAt: Date;
};
