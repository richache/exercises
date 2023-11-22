import "./App.css";
import { useState } from "react";

const addRemote = async (a, b) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(a + b), 100);
  });

// 请实现本地的add方法，调用 addRemote，能最优的实现输入数字的加法。
async function add(...inputs) {
  // 使用map拿到所有addRemote方法返回的promise形成中间数组,然后Promise.all在所有中间数组子项都resolve后得到静态数组,最后reduce求值
  try {
    let promiseArr = inputs.map(it => addRemote(0, it))
    let arr = await Promise.all(promiseArr)
    // console.log(arr)
    const result = arr.reduce((a, b) => a + b)
    return result
  } catch (err) {
    throw new Error("输入值格式有误" + err)
  }
}

/**
 * 要求：
 * 1. 所有的加法都必须使用addRemote
 * 2. 输入错误时，input边框需要变红，Button disable
 * 3. 计算过程 Button与input disable, Button 展示计算中...
 * 3. 计算时间越短越好
 */
function App() {
  // 预设状态
  const [nums, setNums] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);

  const [sum, setSum] = useState(0);
  const [time, setTime] = useState(0);

  // 输入框判断是否Error
  const handelInput = (e) => {
    let val = e.target.value;
    setNums(val);
    val.split(",").map(Number).some(isNaN) ? setErr(true) : setErr(false);
  };

  // 点击按钮 => 进入loading => Promise => 退出loading
  const handelButtonClick = async () => {
    const numbers = nums.split(",").map(Number);
    setLoading(true);
    const start = Date.now();
    const sum = await add(...numbers);
    const time = Date.now() - start;
    setSum(sum);
    setTime(time);
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>
          请实现 App.js 中 add 方法，当用户在输入框中输入多个数字(逗号隔开)时，
          <br />
          点击相加按钮能显示最终结果，并给出计算时间
        </p>
        <div>
          用例：2, 3, 3, 3, 4, 1, 3, 3, 5, 6, 1, 4, 7 ={">"} 45，最慢1200ms
        </div>
      </header>
      <section className="App-content">
        <input onChange={handelInput}
          className={err ? "err" : ""}
          value={nums}
          disabled={loading}
          type="text" placeholder="请输入要相加的数字（如1,4,3,3,5）" />

        {loading
          ? <button disabled={loading}> 计算中...</button>
          : <button onClick={handelButtonClick} disabled={err}>相加</button>
        }
      </section>
      <section className="App-result">
        <p>
          相加结果是：
          {sum}  ， 计算时间是：{time} ms
        </p>
      </section>
    </div>
  );
}

export default App;
