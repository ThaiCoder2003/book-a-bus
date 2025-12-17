declare module "react-input-mask" {
  import * as React from "react";

  export interface InputMaskProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    mask: string;
    maskChar?: string | null;
    alwaysShowMask?: boolean;
    formatChars?: { [key: string]: string };
    inputRef?: React.Ref<HTMLInputElement>;
  }

  const InputMask: React.ForwardRefExoticComponent<
    InputMaskProps & React.RefAttributes<HTMLInputElement>
  >;

  export default InputMask;
}
