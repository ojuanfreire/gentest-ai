import React from "react";

type TextAreaProps = Omit<
  React.ComponentPropsWithRef<"textarea">,
  "className"
> & {
  className?: string;
};

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className = "", ...props }, ref) => {
    const baseClasses =
      "w-full rounded-md border border-slate-600 bg-slate-700 p-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500";

    return (
      <textarea
        ref={ref}
        className={`${baseClasses} ${className}`}
        {...props}
      />
    );
  }
);

TextArea.displayName = "TextArea";
