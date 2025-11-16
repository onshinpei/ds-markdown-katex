import { useMemo, useRef, useState } from 'react';

import Markdown, { ConfigProvider } from 'ds-markdown';
import { katexPlugin } from 'ds-markdown/plugins';

import type { MarkdownRef } from 'ds-markdown';
import dataJson from './data.json';

import 'ds-markdown/katex.css';

function throttle(fn: (...args: any[]) => void, delay: number) {
  let lastTime = 0;
  return (...args: unknown[]) => {
    const now = Date.now();
    if (now - lastTime > delay) {
      fn(...args);
      lastTime = now;
    }
  };
}

const App: React.FC<{
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}> = ({ theme, setTheme }) => {
  const [answerContent, setAnswerContent] = useState('');
  const messageDivRef = useRef<HTMLDivElement>(null!);

  const markdownRef = useRef<MarkdownRef>(null!);

  const [mathOpen, setMathOpen] = useState(true);

  const scrollCacheRef = useRef<{
    type: 'manual' | 'auto';
    needAutoScroll: boolean;
    prevScrollTop: number;
  }>({
    type: 'manual',
    needAutoScroll: true,
    prevScrollTop: 0,
  });

  const onClick = () => {
    setAnswerContent(dataJson.content);
  };
  const onReset = () => {
    setAnswerContent('');
  };

  const throttleOnTypedChar = useMemo(() => {
    return throttle(() => {
      if (!scrollCacheRef.current.needAutoScroll) return;
      const messageDiv = messageDivRef.current;
      // 自动滑动到最底部
      if (messageDiv) {
        messageDiv.scrollTo({
          top: messageDiv.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 50);
  }, []);

  const onScroll = useMemo(() => {
    return throttle((e: React.UIEvent<HTMLDivElement>) => {
      // 如果是往上滚动，则说明是手动滚动，则需要停止自动向下滚动
      // console.log(e.currentTarget.scrollTop - scrollCacheRef.current.prevScrollTop);
      if (e.currentTarget.scrollTop < scrollCacheRef.current.prevScrollTop) {
        scrollCacheRef.current.needAutoScroll = false;
      }
      scrollCacheRef.current.prevScrollTop = e.currentTarget.scrollTop;
    }, 50);
  }, []);

  const interval = 5;
  const flag = true;
  const timerType = flag ? 'requestAnimationFrame' : 'setTimeout';

  return (
    <ConfigProvider katexConfig={{ errorColor: '#00f' }}>
      <div className="ds-message-actions">
        <div>
          {answerContent ? (
            <button className="start-btn" onClick={onReset}>
              重置
            </button>
          ) : (
            <button className="start-btn" onClick={onClick}>
              点击显示
            </button>
          )}
          <span style={{ marginLeft: 30 }}>什么是勾股定理</span>
        </div>
        <div className="theme-btns">
          <button
            className="theme-btn"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            切换为{theme === 'light' ? '暗色' : '亮色'}
          </button>
          <button className="theme-btn" onClick={() => setMathOpen(!mathOpen)}>
            {mathOpen ? '关闭' : '开启'}公式转换
          </button>
          <button
            className="theme-btn"
            onClick={() => markdownRef.current.stop()}
          >
            暂停
          </button>

          <button
            className="theme-btn"
            onClick={() => markdownRef.current.resume()}
          >
            继续
          </button>
        </div>
      </div>
      <div className="ds-message-box" ref={messageDivRef} onScroll={onScroll}>
        <div className="ds-message-list">
          <Markdown
            ref={markdownRef}
            interval={interval}
            answerType="answer"
            onTypedChar={throttleOnTypedChar}
            timerType={timerType}
            theme={theme}
            math={{ splitSymbol: 'bracket' }}
            plugins={mathOpen ? [katexPlugin] : []}
          >
            {answerContent}
          </Markdown>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default App;
