import * as React from "react";
import { Icon } from "@iconify/react";

import { cn } from "@/lib/utils";

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, name, ...props }, ref) => {
    return (
      <div className="relative">
        <textarea
          name={name}
          className={cn(
            "flex h-10 w-full rounded-md border border-input-border bg-input-bg px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-placeholder focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300",
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
TextArea.displayName = "TextArea";

export { TextArea };
