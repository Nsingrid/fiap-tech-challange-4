import Image from "next/image";

export type FeatureHighlightProps = Readonly<{
  title: string;
  text: string;
  iconName: string;
  alt: string;
}>;

export const FeatureHighlight = ({
  title,
  text,
  iconName,
  alt,
}: FeatureHighlightProps) => (
  <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 animate-fade-in">
    <div className="mb-4 p-3 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-full">
      <Image
        src={`/images/icons/${iconName}.svg`}
        width={56}
        height={56}
        alt={alt}
      />
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
  </div>
);
