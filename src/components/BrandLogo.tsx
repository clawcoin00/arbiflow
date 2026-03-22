import Image from 'next/image';

type BrandLogoVariant = 'full' | 'mark';

type BrandLogoProps = {
  variant?: BrandLogoVariant;
  height?: number;
  alt?: string;
  className?: string;
  priority?: boolean;
};

const BRAND_ASSETS: Record<BrandLogoVariant, { src: string; width: number; height: number }> = {
  full: {
    src: '/brand/arbsflow-logo.svg',
    width: 760,
    height: 180,
  },
  mark: {
    src: '/brand/arbsflow-mark.svg',
    width: 220,
    height: 220,
  },
};

export function BrandLogo({
  variant = 'full',
  height = 32,
  alt = 'ArbsFlow',
  className,
  priority = false,
}: BrandLogoProps) {
  const asset = BRAND_ASSETS[variant];
  const width = Math.round((asset.width / asset.height) * height);

  return (
    <Image
      src={asset.src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
    />
  );
}
