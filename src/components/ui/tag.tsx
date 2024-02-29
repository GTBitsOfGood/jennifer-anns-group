import { cn } from "@/lib/utils";
import React from "react";

type TagVariant = "theme" | "accessibility" | "custom" | "game";

export interface TagProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  variant: TagVariant;
}

// Dynamic value workaround https://v2.tailwindcss.com/docs/just-in-time-mode, ugly
const variantBgColorMap: Record<TagVariant, string> = {
  theme: "bg-[#A9CBEB]",
  accessibility: "bg-[#FFE5C6]",
  custom: "bg-[#E2DED5]",
  game: "bg-gray-200",
};

const Tag = ({
  className,
  variant,
  children,
  ...props
}: React.PropsWithChildren<TagProps>) => {
  return (
    <div
      className={cn(
        `text-sm px-4 py-1.5 w-fit rounded-full ${variantBgColorMap[variant]}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Tag.displayName = "Tag";

export { Tag };
