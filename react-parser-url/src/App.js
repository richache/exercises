import './App.css';
import { useState, useEffect, useRef } from 'react';

const defaultParserResult = {
  protocol: '',
  hostname: '',
  port: '',
  pathname: '',
  params: {},
  hash: ''
}

const parserUrl = (url) => {
  // 判断url格式正确性,内容是否为空
  try {
    if (url) {
      const urlobj = new URL(url)
      defaultParserResult.protocol = urlobj.protocol;
      defaultParserResult.hostname = urlobj.hostname;
      defaultParserResult.port = urlobj.port;
      defaultParserResult.pathname = urlobj.pathname;
      defaultParserResult.hash = urlobj.hash;
      defaultParserResult.params = urlobj.search ? parseQueryString(urlobj.search) : "";
    }

    // params解析
    function parseQueryString(search) {
      let pairs = search.slice(1).split("&");
      let paramsMap = pairs.map(pair => {
        let [key, value] = pair.split("=");
        return [decodeURIComponent(key), decodeURIComponent(value)];
      }).reduce((res, [key, value]) => Object.assign(res, { [key]: value }), {});
      return paramsMap || "";
    }

    return defaultParserResult;
  } catch (err) {
    throw new Error("输入的url格式错误:" + err)
  }
};

// 测试用例
parserUrl('https://baidu.com:443/s?wd=hello');
// 输出结果：{ protocol: 'https:', hostname: 'baidu.com', port: '443', pathname: '/s', params: { wd: 'hello' },  hash: '' }


function App() {
  const [result, setResult] = useState(defaultParserResult);
  const urlRef = useRef()
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.keyCode === 13) {
        console.log('这里 处理 Enter 事件');
        // setState 当前Ref <input>元素的value , 这里亦可使用e.target.value
        setResult({ ...parserUrl(urlRef.current.value) });
        // enter后清空输入框: urlRef.current.value = ""
      }
    }
    document.addEventListener('keydown', onKeyDown, false);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div>请实现 App.js 中 parserUrl 方法，当用户在输入框中输入url时，</div>
        <div>点击解析按钮（或者按 enter 快捷键）能够识别出 url 各个组成部分</div>
        <div>并将结果渲染在页面上（tips: 请尽可能保证 parserUrl 的健壮性和完备性）</div>
      </header>
      <section className="App-content">
        <input ref={urlRef} type="text" placeholder="请输入 url 字符串" />
        <button id="J-parserBtn" onClick={() => setResult({ ...parserUrl(urlRef.current.value) })}>解析</button>
      </section>
      <section className="App-result">
        <h2>解析结果</h2>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </section>
    </div>
  );
}

export default App;
