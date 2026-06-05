import Image from "next/image";

type NoLoopLogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  alt?: string;
};

export default function NoLoopLogo({
  className = "",
  imageClassName = "",
  priority = false,
  alt = "NoLoop logo",
}: NoLoopLogoProps) {
  const wrapperClassName = ["relative shrink-0 overflow-hidden", className].filter(Boolean).join(" ");
  const logoClassName = ["object-contain object-center", imageClassName].filter(Boolean).join(" ");

  return (
    <div className={wrapperClassName}>
      <Image
        src="/assets/noLoopLogo.png"
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 48px, 64px"
        className={logoClassName}
      />
    </div>
  );
}
