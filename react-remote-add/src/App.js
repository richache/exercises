import "./App.css";
import { useState } from "react";

const addRemote = async (a, b) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(a + b), 100);
  });

// 请实现本地的add方法，调用 addRemote，能最优的实现输入数字的加法。
async function add(...inputs) {
  try {
    // 1. 模拟遍历: (单线程)
    // let result = inputs[0]
    // for (let i = 1; i < inputs.length; i++) {
    //   let val = await addRemote(inputs[i], 0)
    //   result += val
    // }

    // 2. 模拟遍历, 使用二分法传参, 缩短一半promise.resolve时间 (双线程)
    // let result = inputs[0]
    // for (let i = 1, j = inputs.length - 1; i <= j; i++, j--) {
    //   let val
    //   if (i === j) {
    //     val = await addRemote(inputs[i], 0)
    //   } else {
    //     val = await addRemote(inputs[i], inputs[j])
    //   }
    //   result += val
    // }

    // 3. Promise.all (多线程, 所有promise都resolve后统一返回结果)
    // 使用map拿到所有addRemote方法返回的promise形成中间数组, 然后Promise.all在所有中间数组子项都resolve后得到静态数组, 最后reduce求值
    //       (但其实这个Promise.all只是为了用addRemote而用, 并没有实现真正的add方法,相当于直接对源数组做reduce)
    // let promiseArr = inputs.map(it => addRemote(it, 0))
    // let arr = await Promise.all(promiseArr)
    // // console.log(arr)
    // const result = arr.reduce((a, b) => a + b)

    // 4. 递归 (多线程, 最快)
    // 每个线程pop出2项相加,resolve后把结果push进目标数组,只要当前数组长度大于1,则继续递归;数组长度为1,则resolve出这一项作为结果
    let result = new Promise(res => {
      let count = 0
      const needAdd = inputs.length - 1
      while (inputs.length > 1) {
        addTwo()
      }

      function addTwo() {
        if (inputs.length >= 2) {
          let a = inputs.pop()
          let b = inputs.pop()
          // console.log("调用addRemote")
          addRemote(a, b).then(num => {
            inputs.push(num)
            count++
            if (count === needAdd) {
              res(inputs[0])
            } else {
              addTwo()
            }
          })
        }
      }
    })

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
