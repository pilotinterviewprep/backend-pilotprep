export type TImage = { name: string; path: string; bucket_id: string };

export type TDeleteImagePayload = {
  images_path: string[];
};

export type TUpdateImagePayload = {
  name?: string;
  alt_text?: string;
};
