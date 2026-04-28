import React from "react";
import { Image } from "antd";
import clsx from "clsx";

type AppImageProps = {
  src: string;
  alt?: string;
  className?: string;
  preview?: boolean;
};

export const AppImagePreview: React.FC<AppImageProps> = ({
  src,
  alt,
  className,
  preview = true,
}) => {
  return (
    <div
      className={clsx(
        "w-full aspect-square overflow-hidden rounded-xl",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        preview={preview}
        width="100%"
        height="100%"
        className="object-cover"
      />
    </div>
  );
};

export const AppImageLarge: React.FC<AppImageProps> = ({
  src,
  alt,
  className,
  preview = true,
}) => {
  return (
    <div
      className={clsx(
        "w-full overflow-hidden rounded-2xl",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        preview={preview}
        width="100%"
        className="object-contain"
      />
    </div>
  );
};