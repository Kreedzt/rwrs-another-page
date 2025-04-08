import { useState, useCallback, useEffect } from 'preact/hooks';

/**
 * Custom hook for persisting state in local storage
 * @param key - The local storage key
 * @param initialValue - Default value if key doesn't exist in local storage
 * @returns State value and function to update it
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // 使用懒初始化函数获取存储值或使用默认值
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage key:', key, error);
      return initialValue;
    }
  });

  // 返回一个包装版的setState函数，将新值同步到localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // 允许值是一个函数，与useState相同
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
          
        // 保存state
        setStoredValue(valueToStore);
        
        // 保存到localStorage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error('Error setting localStorage key:', key, error);
      }
    },
    [key, storedValue]
  );

  // 监听其他窗口中的storage变化并更新state
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error parsing localStorage value:', error);
        }
      }
    };
    
    // 添加事件监听
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      
      // 清理函数
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [key]);

  return [storedValue, setValue];
} 