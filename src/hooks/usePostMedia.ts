import { AxiosError } from "axios";
import { ChangeEvent, useState } from "react";
import apis from "src/apis";

export type Media = {
  model_id: number;
  original_url: string;
  model_type: string;
};

type PostType = {
  e: ChangeEvent<HTMLInputElement>;
  callBack?: (data: Media[]) => void;
  onError?: (error: AxiosError) => void;
};

export function usePostMedia() {
  const [medias, setMedias] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  console.log(isLoading);
  const handlePostMedia = async ({ e, callBack, onError }: PostType) => {
    if (e.target.files) {
      setIsLoading(true);
      let tempImages: Media[] = [];
      for (var j = 0; j < e.target.files?.length; j++) {
        const item = {
          model_id: -j,
          original_url: URL.createObjectURL(e.target.files[j]),
          model_type: e.target.files[j].type,
        };
        tempImages.push(item);
      }
      if (callBack) {
        callBack(tempImages);
      }
      try {
        const mediaList: Media[] = [];
        for (var i = 0; i < e.target.files?.length; i++) {
          const fileItem = e.target.files[i];
          let formData = new FormData();
          let resMedia = {
            original_url: URL.createObjectURL(fileItem),
            model_id: i,
            model_type: e.target.files[i].type,
          };
          formData.append("file", fileItem);
          let res: any;
          res = await apis
            .postMedia(formData)
            .then((res: any) => res.data.context);
          if (res) {
            resMedia = { ...resMedia, model_id: res.model_id };
          }
          mediaList.push(resMedia);
        }
        setMedias(mediaList);
        setIsLoading(false);
        if (callBack) {
          callBack(mediaList);
        }
      } catch (error) {
        const err = error as AxiosError;
        if (onError) {
          onError(err);
        }
      }
    }
  };

  return {
    medias,
    handlePostMedia,
    isLoading,
  };
}
