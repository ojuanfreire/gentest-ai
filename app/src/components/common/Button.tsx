import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ children, ...props }: ButtonProps) => {
  return <button {...props}>{children}</button>;
};
