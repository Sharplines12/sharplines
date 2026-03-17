type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  copy: string;
};

export function SectionHeading({ eyebrow, title, copy }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-5 text-4xl uppercase leading-none text-slate-950 sm:text-5xl">{title}</h2>
      {copy ? <p className="mt-4 text-base leading-7 text-slate-600">{copy}</p> : null}
    </div>
  );
}
