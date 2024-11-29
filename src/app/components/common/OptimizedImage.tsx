'use client';

import React from 'react';
import Image from 'next/image';
import type { ImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<ImageProps, 'width' | 'height'> {
  width?: number;
  height?: number;
  mobileWidth?: number;
  mobileHeight?: number;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width = 800,
  height = 800,
  mobileWidth = 400,
  mobileHeight = 400,
  className = '',
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
  quality = 85,
  ...props
}) => {
  return (
    <div className="relative w-full h-full">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        quality={quality}
        priority={priority}
        className={`w-full h-full object-cover transition-all duration-300 ${className}`}
        {...props}
      />
    </div>
  );
};