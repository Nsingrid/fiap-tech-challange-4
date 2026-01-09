import { VectorImage } from "../vector-image/vector-image";

export type HomeBannerProps = Readonly<{
  title: string;
}>;

export const HomeBanner = ({ title }: HomeBannerProps) => (
  <div className="py-12 md:py-20">
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
        Diga adeus ao{" "}
        <span className="inline-flex items-center bg-[#c8e6c9] px-3 py-1 rounded-lg">
          💰 estresse
        </span>{" "}
        financeiro e à incerteza
      </h1>
      <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
        Com nossa interface amigável e recursos poderosos, você terá todas as ferramentas necessárias para gerenciar suas finanças com facilidade.
      </p>
    </div>
  </div>
);
