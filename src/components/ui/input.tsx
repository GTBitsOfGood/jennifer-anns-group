import * as React from "react";
import { Icon } from "@iconify/react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, name, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const inputType = showPassword ? "text" : type;

    return (
      <div className="relative">
        <input
          name={name}
          type={inputType}
          className={cn(
            "flex h-10 w-full rounded-md border border-input-border bg-input-bg px-3 py-2 text-xs file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-placeholder focus-visible:outline-none dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300",
            className
          )}
          ref={ref}
          {...props}
        />
        {type === "password" ? (
          <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400">
            {showPassword ? (
              <Icon
                icon="streamline:visible-solid"
                className="h-4 w-4"
                onClick={togglePasswordVisibility}
              />
            ) : (
              <Icon
                icon="streamline:invisible-1-solid"
                className="h-4 w-4"
                onClick={togglePasswordVisibility}
              />
            )}
          </div>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
