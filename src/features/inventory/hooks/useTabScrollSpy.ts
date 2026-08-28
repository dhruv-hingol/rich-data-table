// Custom hook for ScrollSpy active tab tracking and anti-flicker programmatic section scrolling.
import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseTabScrollSpyParams {
  tabs: { id: string; label: string }[];
  defaultTabId?: string;
  headerOffset?: number;
  scrollOffset?: number;
  containerSelector?: string;
  isDisabled?: boolean;
}

export function useTabScrollSpy({
  tabs,
  defaultTabId,
  headerOffset = 130,
  scrollOffset = 145,
  containerSelector = '.overflow-y-auto',
  isDisabled = false,
}: UseTabScrollSpyParams) {
  const [activeTab, setActiveTab] = useState<string>(
    defaultTabId || (tabs.length > 0 ? tabs[0].id : '')
  );
  const isProgrammaticScrollRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ScrollSpy: Automatically update activeTab to match section visible below sticky header on manual scroll
  useEffect(() => {
    if (isDisabled || tabs.length === 0) return;

    const sectionIds = tabs.map((t) => t.id);

    const handleScroll = () => {
      if (isProgrammaticScrollRef.current) return;

      const scrollContainer = document.querySelector(containerSelector);
      const scrollTop = scrollContainer
        ? scrollContainer.scrollTop
        : window.scrollY;
      const targetOffset = scrollTop + scrollOffset;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= targetOffset) {
          setActiveTab(sectionIds[i]);
          break;
        }
      }
    };

    const container = document.querySelector(containerSelector) || window;
    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [tabs, scrollOffset, containerSelector, isDisabled]);

  // Programmatic anti-flicker click smooth-scrolling to target section
  const scrollToSection = useCallback(
    (sectionId: string) => {
      setActiveTab(sectionId);
      isProgrammaticScrollRef.current = true;

      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }

      const el = document.getElementById(sectionId);
      const container = document.querySelector(containerSelector);
      if (el && container) {
        const targetPos = Math.max(0, el.offsetTop - headerOffset);
        container.scrollTo({
          top: targetPos,
          behavior: 'smooth',
        });
      }

      scrollTimerRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 600);
    },
    [headerOffset, containerSelector]
  );

  return {
    activeTab,
    setActiveTab,
    scrollToSection,
  };
}

export default useTabScrollSpy;
