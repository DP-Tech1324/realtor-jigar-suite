import React from "react";

type ImageProps = {
  src: string;
  alt?: string;
  className?: string;
  loading?: "lazy" | "eager";
};

const Image: React.FC<ImageProps> = ({
  src,
  alt = "Image",
  className = "",
  loading = "lazy",
}) => {
  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      className={`object-cover ${className}`}
      onError={(e) => {
        (e.target as HTMLImageElement).src = "/fallback.jpg"; // fallback image in /public
      }}
    />
  );
};

export default Image;
