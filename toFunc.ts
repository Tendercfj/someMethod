// async function loadPageData(userId) {
//   try {
//      const user = await fetchUserById(userId);
//      console.log('用户信息:', user.name);
 
//      try {
//        const posts = await fetchPostsByUserId(user.id);
//        console.log('用户文章:', posts);
 
//        try {
//          const comments = await fetchCommentsForPosts(posts[0].id);
//          console.log('文章评论:', comments);
//        } catch (commentError) {
//          console.error('获取评论失败:', commentError);
//        }
//      } catch (postError) {
//        console.error('获取文章失败:', postError);
//      }
//    } catch (userError) {
//      console.error('获取用户失败:', userError);
//    }
//  }


/**
 * 看到这些层层嵌套的 try...catch，你是否感到了一丝窒息？这种写法存在几个明显的问题：

代码冗余：每个异步操作都需要重复的 try...catch 结构，增加了大量样板代码。
可读性差：核心的“快乐路径”（Happy Path）代码被包裹在 try 块中，增加了缩进层次，干扰了正常的阅读流。
关注点混合：成功逻辑和失败逻辑紧密地耦合在同一个代码块里，使得函数职责不够单一。
那么，有没有一种方法可以摆脱这种困境呢？答案是肯定的。



优雅的解决方案：Go 语言风格的错误处理
我们可以借鉴 Go 语言的错误处理模式。在 Go 中，函数通常会返回两个值：result 和 error。调用者通过检查 error 是否为 nil 来判断操作是否成功。

我们可以将这种思想引入到 JavaScript 的 async/await 中。创建一个辅助函数（我们称之为 to），它接收一个 Promise作为参数，并且永远不会被 reject。相反，它总是 resolve 一个数组，格式为 [error, data]。

如果 Promise 成功 resolve，它返回 [null, data]。
如果 Promise 失败 reject，它返回 [error, null]。

 */


/**
 * @description 接受一个promise，返回一个数组[error, data]
 * @param {promise<T>} promise - 要处理的promise 
 * @returns {promise<[Error | null, T | undefined]>} 返回一个promise，数组中第一个元素是错误信息，第二个元素是数据
 */
export function to<T>(promise: Promise<T>): Promise<[Error | null, T | undefined]>{
  return promise
    .then<[null,T]>((data:T) => [null, data])
    .catch<[Error, undefined]>((error:Error) => [error, undefined]);
}

// async function displayUser(userId: number) {
//   const [userError, user] = await to(fetchUserById(userId));
//   if(userError || !user){
    // 处理错误的逻辑
//     return;
//   }
//   console.log('用户信息:', user.name);
// }




// 1.使用 to 辅助函数，简化异步代码

// async function loadPageData(userId) {
//    const [userError,user] = await to(fetchUserById(userId));
//     if(userError || !user){
//       // 处理错误的逻辑
//       return;
//     }
//     console.log('用户信息:', user.name);

//     const [postError,posts] = await to(fetchPostsByUserId(user.id));
//     if(postError || !posts){
//       // 处理错误的逻辑
//       return;
//     }
//     console.log('用户文章:', posts);

//     const [commentError,comments] = await to(fetchCommentsForPosts(posts[0].id));
//     if(commentError || !comments){
//       // 处理错误的逻辑
//       return;
//     }
//     console.log('文章评论:', comments);
//  }

// 2. 配合promise.all，可以实现并行请求

// async function loadDashboard(userId) {
//   const [
//      [userError, userData],
//      [settingsError, settingsData]
//    ] = await Promise.all([
//      to(fetchUser(userId)),
//      to(fetchUserSettings(userId))
//    ]);
 
//   if (userError) {
//      console.error('加载用户数据失败');
//      // 处理用户错误
//    }
 
//   if (settingsError) {
//      console.error('加载用户设置失败');
//      // 处理设置错误
//    }
 
//   // 即使其中一个失败，另一个成功的数据依然可用
//   if (userData) {
//      // ...
//    }
//   if (settingsData) {
//      // ...
//    }
//  }