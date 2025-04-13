import React, { useEffect, useRef } from 'preact/compat';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/custom/search-input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ColumnToggle } from './ColumnToggle';
// COLUMNS_LIST is no longer needed
import { QuickFilterButtons } from './QuickFilterButtons';
import { RefreshCw, List, MapPin } from 'lucide-react';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { useTourGuide } from '../hooks/useTourGuide';
import { LanguageSwitcher } from '@/components/custom/language-switcher';

interface TableHeaderProps {
  searchQuery: string;
  quickFilters: string[];
  isLoading: boolean;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  onRefresh: () => void;
  onQuickFilter: (filterId: string) => void;
  autoRefresh: boolean;
  onAutoRefreshChange: (checked: boolean) => void;
  columnVisibility: Record<string, boolean>;
  onColumnToggle: (columnId: string, checked: boolean) => void;
  viewMode: 'table' | 'map';
  onViewModeToggle: () => void;
  isMultiSelect: boolean;
  onMultiSelectChange: (checked: boolean) => void;
}

// Title is now handled by FormattedMessage

export const TableHeader: React.FC<TableHeaderProps> = ({
  searchQuery,
  quickFilters,
  isLoading,
  onSearch,
  onReset,
  onRefresh,
  onQuickFilter,
  autoRefresh,
  onAutoRefreshChange,
  columnVisibility,
  onColumnToggle,
  viewMode,
  onViewModeToggle,
  isMultiSelect,
  onMultiSelectChange,
}) => {
  const { startTour } = useTourGuide();
  const intl = useIntl();
  const titleRef = useRef<HTMLHeadingElement>(null);
  // const [titleReady, setTitleReady] = useState(true); // 默认为true，避免闪烁

  // 使用布局效果确保标题立即渲染
  useEffect(() => {
    // 立即显示标题内容
    if (titleRef.current) {
      // 确保可见性和布局优先级
      titleRef.current.dataset.priority = 'true';

      // 关键：直接强制执行重绘，这里帮助减少渲染延迟
      titleRef.current.style.opacity = '1';

      // 直接触发布局计算，强制浏览器立即完成LCP
      void titleRef.current.offsetWidth;
    }

    // 监听DOMContentLoaded确保页面结构已经加载完成
    const handleLoad = () => {
      if (titleRef.current) {
        // 进一步确保标题的可见性和优先级
        titleRef.current.dataset.priority = 'true';
        titleRef.current.style.opacity = '1';
      }
    };

    // 使用更直接的事件监听
    document.addEventListener('DOMContentLoaded', handleLoad);

    return () => {
      document.removeEventListener('DOMContentLoaded', handleLoad);
    };
  }, []);

  return (
    <div class="flex flex-col space-y-2 py-2 h-auto md:min-h-[120px]">
      <div class="flex items-center justify-between mb-4">
        <h1
          ref={titleRef}
          class="text-xl font-bold truncate mr-4 max-w-[60%] opacity-100"
          data-priority="true"
        >
          <FormattedMessage id="app.title" defaultMessage="RWRS Another Page" />
        </h1>
        <div className="flex items-center shrink-0">
          <Button
            id="view-mode-toggle"
            variant="outline"
            size="icon"
            onClick={onViewModeToggle}
            title={intl.formatMessage({
              id: viewMode === 'table' ? 'app.viewMode.table' : 'app.viewMode.map',
              defaultMessage: viewMode === 'table' ? 'Switch to Map Order View' : 'Switch to Table View'
            })}
            className="mr-2"
          >
            {viewMode === 'table' ? (
              <MapPin className="h-5 w-5" />
            ) : (
              <List className="h-5 w-5" />
            )}
          </Button>
          <Button
            id="help-guide-toggle"
            variant="ghost"
            size="icon"
            onClick={startTour}
            title={intl.formatMessage({ id: 'app.help.title', defaultMessage: 'Show Help Guide' })}
            className="bg-transparent hover:bg-transparent mr-2"
          >
            <QuestionMarkCircledIcon className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          </Button>
          <LanguageSwitcher />
        </div>
      </div>
      <div class="w-full flex items-center">
        <SearchInput
          id="search-input"
          rootClassName="flex-1"
          type="text"
          aria-label={intl.formatMessage({ id: 'app.search.placeholder', defaultMessage: 'Search servers, maps, players, mode, country, etc...' })}
          value={searchQuery}
          onInput={onSearch}
          placeholder={intl.formatMessage({ id: 'app.search.placeholder', defaultMessage: 'Search servers, maps, players, mode, country, etc...' })}
          disabled={isLoading}
        />
        <div class="items-center hidden md:flex">
          <Button className="ml-2" disabled={isLoading} onClick={onReset}>
            <FormattedMessage id="app.button.reset" defaultMessage="Reset" />
          </Button>
          <Button disabled={isLoading} className="ml-2" onClick={onRefresh}>
            <FormattedMessage id="app.button.refresh" defaultMessage="Refresh" />
          </Button>
          <div className="ml-2 flex items-center">
            <Switch
              checked={autoRefresh}
              onCheckedChange={onAutoRefreshChange}
              disabled={isLoading}
            />
            <Label className="ml-2">
              <FormattedMessage id="app.switch.autoRefresh" defaultMessage="Auto Refresh" />
            </Label>
          </div>
          {viewMode === 'table' && (
            <div className="ml-2" id="column-toggle">
              <ColumnToggle
                columnVisibility={columnVisibility}
                onColumnToggle={onColumnToggle}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile refresh button - visible only on mobile */}
      <div className="md:hidden w-full">
        <Button
          variant="outline"
          className="w-full"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          <FormattedMessage id="app.button.refresh" defaultMessage="Refresh" />
        </Button>
      </div>

      <div className="w-full">
        <QuickFilterButtons
          isLoading={isLoading}
          onQuickFilter={onQuickFilter}
          activeFilter={quickFilters}
          isMultiSelect={isMultiSelect}
          onMultiSelectChange={onMultiSelectChange}
        />
      </div>
    </div>
  );
};
