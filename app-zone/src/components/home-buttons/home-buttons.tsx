"use client";

export type HomeButtonsProps = Readonly<{
  onSignInButtonClick: () => void;
  onSignUpButtonClick: () => void;
}>;

export const HomeButtons = ({
  onSignUpButtonClick,
}: HomeButtonsProps) => {
  return (
    <div className="flex justify-center mb-16">
      <button
        onClick={onSignUpButtonClick}
        className="px-8 py-3.5 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors text-sm"
      >
        COMEÇAR AGORA
      </button>
    </div>
  );
};
