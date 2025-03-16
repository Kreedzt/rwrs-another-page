interface HighlightTextProps {
  text: string;
  searchQuery: string;
}

export const HighlightText: React.FC<HighlightTextProps> = ({
  text,
  searchQuery,
}) => {
  if (!searchQuery || !text) return <>{text}</>;

  const parts = text.toString().split(new RegExp(`(${searchQuery})`, 'gi'));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === searchQuery.toLowerCase() ? (
          <span key={i} className="bg-yellow-400 dark:bg-yellow-800">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
};
