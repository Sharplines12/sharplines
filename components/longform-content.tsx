type LongformContentProps = {
  content: string[];
};

export function LongformContent({ content }: LongformContentProps) {
  return (
    <div className="mt-8 space-y-5 text-sm leading-8">
      {content.map((block, index) => {
        if (block.startsWith("## ")) {
          return (
            <h2 key={`${index}-${block}`} className="pt-4 text-3xl uppercase text-white">
              {block.replace(/^##\s+/, "")}
            </h2>
          );
        }

        if (block.startsWith("### ")) {
          return (
            <h3 key={`${index}-${block}`} className="pt-2 text-xl uppercase text-aqua">
              {block.replace(/^###\s+/, "")}
            </h3>
          );
        }

        return <p key={`${index}-${block.slice(0, 24)}`}>{block}</p>;
      })}
    </div>
  );
}
