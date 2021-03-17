const delay = function delay(interval) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          if (interval === 1003) reject('xxx');
          resolve(interval);
      }, interval);
  });
};
let tasks = [() => {
  return delay(1000);
}, () => {
  return delay(1003);
}, () => {
  return delay(1005);
}, () => {
  return delay(1002);
}, () => {
  return delay(1004);
}, () => {
  return delay(1006);
}, () => {
  return delay(1007);
}];

// 方案2:利用队列的机制处理
class TaskQueue {
  constructor(tasks, limit, callback) {
      let self = this;
      self.tasks = tasks;
      self.limit = limit;
      self.callback = callback;
      self.queue = [];
      self.results = [];
      self.runing = 0;
      self.index = 0;
  }
  // 把任务依次存储到任务队列中
  pushStack(task) {
      let self = this,
          queue = self.queue;
      queue.push(task);
      self.next();
  }
  // 执行next方法，按照顺序把任务执行「并发管控」
  async next() {
      let self = this,
          {
              limit,
              runing,
              results,
              queue,
              tasks,
              callback
          } = self;
      if (runing < limit && self.index <= tasks.length - 1) {
          self.runing++;
          let prevIndex = self.index,
              task = queue[self.index++],
              temp;
          if (typeof task === "function") {
              try {
                  temp = await task();
                  results[prevIndex] = temp;
              } catch (err) {
                  results[prevIndex] = null;
              }
          }
          self.runing--;
          self.runing === 0 ? callback(results) : self.next();
      }
  }
}
const createRequest = function createRequest(tasks, limit, callback) {
  if (!Array.isArray(tasks)) throw new TypeError('tasks must be an array!');
  if (typeof limit === "function") {
      callback = limit;
      limit = 2;
  }
  if (typeof limit !== "number") limit = 2;
  if (typeof callback !== "function") callback = Function.prototype;
  // 依次把总任务列表中的每一项放置在任务队列中，并且通知任务执行「有限制」
  let TQ = new TaskQueue(tasks, limit, callback);
  tasks.forEach(task => {
      TQ.pushStack(task);
  });
};

createRequest(tasks, results => {
  console.log('ALL DONE', results);
});


// 方案1:限制并发的数量limit，限制多少个，我们创造多少个工作区；每个工作区都在发送请求，如果其中某个工作区请求成功，我们从总任务中，继续拿到下一个任务放到这个工作区中去处理；
// tasks:总任务列表「数组，数组中每一项是一个函数，函数执行发送ajax请求，返回的是一个Promise实例」
// limit:限制并发的数量「建议一般小于5个」
/* 
const createRequest = function createRequest(tasks, limit) {
  if (typeof limit !== "number") limit = 2;
  if (!Array.isArray(tasks)) throw new TypeError('tasks must be an array!');
  let results = [],
      index = 0,
      works = new Array(limit).fill(null);
  works = works.map(() => {
      // 让每个工作区都是一个Promise实例，当这个工作区没有再需要处理的任务了，我们让实例为成功，认为这个工作区是处理完成的
      return new Promise(resolve => {
          const next = async () => {
              let prevIndex = index,
                  task = tasks[index++],
                  temp;
              if (index > tasks.length - 1) {
                  // 当前工作区都处理完了
                  resolve();
                  return;
              }
              if (typeof task === "function") {
                  try {
                      // 当前任务处理成功，直接把处理后的结果按照指定索引位置，存储到总结果中
                      temp = await task();
                      results[prevIndex] = temp;
                  } catch (err) {
                      // 即使当前任务是失败的，我们也给其存储一个null即可
                      results[prevIndex] = null;
                  }
                  next();
              }
          };
          next();
      });
  });
  // 当所有工作区都是成功处理完的，最后整体认为所有的任务都处理完成了
  return Promise.all(works).then(() => results);
};

createRequest(tasks, 2).then(results => {
  // 都处理完成后触发执行,results中包含了处理的结果「因为是并行，每个请求之间没有关联性，所以其中某个请求如果失败，我们不想限制后续请求的发送」
  console.log('ALL DONE', results);
}); 
*/