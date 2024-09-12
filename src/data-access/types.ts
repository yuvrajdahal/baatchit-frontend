export type User = {
  profilePicture?: string;
  username: string;
  fullname: string;
  email: string;
  emailToken?: string;
  password: string;
  isVerified: boolean;
  posts?: Post[];
  createdAt: Date;
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
