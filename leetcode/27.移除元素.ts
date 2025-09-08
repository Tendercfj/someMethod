/**
 * 
 * 双指针法
双指针法（快慢指针法）： 通过一个快指针和慢指针在一个for循环下完成两个for循环的工作。

定义快慢指针

快指针：寻找新数组的元素 ，新数组就是不含有目标元素的数组
慢指针：指向更新 新数组下标的位置
很多同学这道题目做的很懵，就是不理解 快慢指针究竟都是什么含义，所以一定要明确含义，后面的思路就更容易理解了。


https://programmercarl.com/0027.%E7%A7%BB%E9%99%A4%E5%85%83%E7%B4%A0.html#%E6%80%9D%E8%B7%AF

 * 
 */


function removeElement(nums: number[], val: number): number {
  let slow = 0;
  for(let fast = 0; fast < nums.length; fast++){
      if(nums[fast] !== val){
          nums[slow++] = nums[fast]
      }
  }
  return slow
};

const removeElement2 = (nums: number[], val: number): number => {
  let slow = 0, fast = 0;
  while(fast < nums.length){
      if(nums[fast] !== val){
          nums[slow++] = nums[fast]
      }
      fast++;
  }
  return slow
}