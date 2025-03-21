import { useCallback, useMemo } from 'preact/compat';
import { FilterFn } from '@tanstack/react-table';
import { IDisplayServerItem } from '@/models/data-table.model';
import { FilterValue } from '../types';
import { filters } from '../components/QuickFilterButtons';

export function useTableFilter() {
  // 为文本搜索创建筛选函数
  const applyTextSearch = useCallback((row: IDisplayServerItem, searchValue: string): boolean => {
    // 如果搜索为空，直接返回 true
    if (!searchValue) return true;
    
    // 缓存常用转换的值避免重复计算
    const name = row.name.toString().toLowerCase();
    const country = row.country.toLowerCase();
    const mode = row.mode.toLowerCase();
    const mapId = row.mapId.toLowerCase();
    const comment = row.comment?.toLowerCase() || '';
    const url = row.url?.toLowerCase() || '';
    const portStr = row.port.toString();
    const playersStr = row.currentPlayers.toString();
    const versionStr = row.version.toString();
    const lastMapIdPart = mapId.split('/').pop() || '';
    
    // 执行所有必要的比较
    return (
      name.includes(searchValue) ||
      row.ipAddress.includes(searchValue) ||
      portStr.includes(searchValue) ||
      country.includes(searchValue) ||
      mode.includes(searchValue) ||
      lastMapIdPart.includes(searchValue) ||
      comment.includes(searchValue) ||
      url.includes(searchValue) ||
      versionStr.includes(searchValue) ||
      playersStr.includes(searchValue) ||
      row.playerList.some(
        player => typeof player === 'string' && player.toLowerCase().includes(searchValue)
      )
    );
  }, []);

  // 创建优化的模糊筛选函数
  const onFuzzyFilter = useCallback<FilterFn<IDisplayServerItem>>(
    (row, _columnId, value) => {
      // 确保值不为空
      if (!value) return true;
      
      // 处理字符串值（向后兼容）
      if (typeof value === 'string') {
        return applyTextSearch(row.original, value.toLowerCase());
      }

      // 处理组合筛选值
      try {
        const filterValue = value as FilterValue;
        
        // 安全检查：确保 filterValue 包含必要属性
        if (!filterValue || typeof filterValue !== 'object') return true;
        
        const searchQuery = filterValue.searchQuery ? filterValue.searchQuery.toLowerCase() : '';
        const activeFilters = filterValue.quickFilters || [];
        
        // 确定行是否通过文本搜索查询
        const passesTextSearch = applyTextSearch(row.original, searchQuery);
        
        // 如果没有活跃的过滤器，跳过过滤检查
        if (activeFilters.length === 0) return passesTextSearch;
        
        // 检查是否通过任一活跃过滤器
        const passesQuickFilters = activeFilters.some(filterId => {
          const filterObj = filters.find(f => f.id === filterId);
          return filterObj ? filterObj.filter(row.original) : true;
        });
        
        // 两个条件都必须满足
        return passesTextSearch && passesQuickFilters;
      } catch (e) {
        console.error('筛选错误:', e);
        return true; // 错误时默认显示所有数据
      }
    },
    [applyTextSearch],
  );

  // 返回经过记忆化的筛选函数，避免不必要的重新创建
  return useMemo(() => ({ onFuzzyFilter }), [onFuzzyFilter]);
}
