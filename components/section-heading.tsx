type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  copy: string;
};

export function SectionHeading({ eyebrow, title, copy }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-5 text-4xl uppercase leading-none text-white sm:text-5xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-mist/75">{copy}</p>
    </div>
  );
}
