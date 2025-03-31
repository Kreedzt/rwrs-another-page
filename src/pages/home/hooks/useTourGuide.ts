import { useCallback, useEffect } from 'preact/hooks';
import { useLocalStorage } from '../../../hooks/useLocalStorage';

// 简化版本的Tour指南实现，避免类型定义问题
// 在实际项目中再合适的时候集成完整的Shepherd.js

/**
 * 简化版的Tour指南实现
 * 只提供接口，不实际显示引导
 */
export const useTourGuide = () => {
  const [hasSeenTour, setHasSeenTour] = useLocalStorage<boolean>('hasSeenTour', false);

  // 启动导览（简化实现）
  const startTour = useCallback(() => {
    console.log('Tour would start here');
    setHasSeenTour(true);
  }, [setHasSeenTour]);

  // 自动开始导览（仅在首次使用）
  useEffect(() => {
    const autoStartTimeout = setTimeout(() => {
      if (!hasSeenTour) {
        // 在此处触发导览，现在仅记录状态
        console.log('Auto tour would start here for first-time users');
        setHasSeenTour(true);
      }
    }, 2000); // 延迟2秒，等LCP完成后再显示导览
    
    return () => clearTimeout(autoStartTimeout);
  }, [hasSeenTour, setHasSeenTour]);

  return { startTour };
};

export default useTourGuide; 