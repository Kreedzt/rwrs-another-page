import { memo, useMemo } from 'preact/compat';

interface HighlightTextProps {
  text: string;
  searchQuery: string;
}

// 使用 memo 包装组件，避免不必要的重新渲染
export const HighlightText: React.FC<HighlightTextProps> = memo(({
  text,
  searchQuery,
}) => {
  // 快速返回：如果没有搜索查询或文本为空
  if (!searchQuery || !text) return <>{text}</>;
  
  // 避免大型字符串上过于复杂的正则操作可能引起的性能问题
  // 使用 useMemo 缓存拆分结果，避免在每次渲染时重新计算
  const parts = useMemo(() => {
    try {
      // 限制文本长度，避免超大字符串处理
      const limitedText = text.length > 1000 ? text.substring(0, 1000) + '...' : text;
      // 对搜索查询进行转义，以避免特殊字符导致的正则错误
      const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return limitedText.toString().split(new RegExp(`(${escapedQuery})`, 'gi'));
    } catch (e) {
      // 如果正则处理出错，直接返回原始文本
      console.error('Error splitting text:', e);
      return [text];
    }
  }, [text, searchQuery]);
  
  // 预先计算小写的搜索查询，避免在每个部分比较时重复转换
  const lowerSearchQuery = searchQuery.toLowerCase();

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === lowerSearchQuery ? (
          <span key={i} className="bg-yellow-400 dark:bg-yellow-800">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
});
