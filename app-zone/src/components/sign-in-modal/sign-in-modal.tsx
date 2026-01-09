"use client";
import { useRef, useEffect, type FormEventHandler } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Button } from "~/components/button/button";

const schema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(8, { message: "Mínimo 8 caracteres" }),
});

export type SignInValue = z.infer<typeof schema>;

export type SignInModalProps = Readonly<{
  open: boolean;
  onClose: () => void;
  onSignIn?: (data: SignInValue) => void;
}>;

export const SignInModal = ({ open, onClose, onSignIn }: SignInModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [open]);

  const form = useForm({
    defaultValues: { email: "", password: "" },
    onSubmit: async ({ value }) => {
      if (onSignIn) {
        onSignIn(value);
      }
      form.reset();
      onClose();
    },
    validators: {
      onSubmit: schema,
    },
  });

  const submitForm: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    form.handleSubmit();
  };

  return (
    <dialog 
      ref={dialogRef}
      className="p-0 rounded-2xl shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm max-w-md w-full"
    >
      <div className="bg-white p-8 rounded-2xl">
        <button
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors text-2xl"
          onClick={onClose}
          aria-label="Fechar modal"
        >
          &times;
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Entrar</h2>
        
        <form className="space-y-5" onSubmit={submitForm} autoComplete="off">
          <div className="flex flex-col gap-2">
            <label htmlFor="sign-in-email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <form.Field name="email">
              {(field) => (
                <>
                  <input
                    id="sign-in-email"
                    type="email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <span className="text-sm text-red-600 mt-1">
                      {field.state.meta.errors[0]?.message}
                    </span>
                  )}
                </>
              )}
            </form.Field>
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="sign-in-password" className="text-sm font-medium text-gray-700">
              Senha
            </label>
            <form.Field name="password">
              {(field) => (
                <>
                  <input
                    id="sign-in-password"
                    type="password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <span className="text-sm text-red-600 mt-1">
                      {field.state.meta.errors[0]?.message}
                    </span>
                  )}
                </>
              )}
            </form.Field>
          </div>
          
          <Button variant="modalPrimary" size="full" type="submit">
            Entrar
          </Button>
        </form>
      </div>
    </dialog>
  );
};
