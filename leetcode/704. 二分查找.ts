/**
 * 这道题目的前提是数组为有序数组，同时题目还强调数组中无重复元素，因为一旦有重复元素，使用二分查找法返回的元素下标可能不是唯一的，这些都是使用二分法的前提条件，当大家看到题目描述满足如上条件的时候，可要想一想是不是可以用二分法了。
 * 
 * 二分查找涉及的很多的边界条件，逻辑比较简单，但就是写不好。例如到底是 while(left < right) 还是 while(left <= right)，到底是right = middle呢，还是要right = middle - 1呢？

大家写二分法经常写乱，主要是因为对区间的定义没有想清楚，区间的定义就是不变量。要在二分查找的过程中，保持不变量，就是在while寻找中每一次边界的处理都要坚持根据区间的定义来操作，这就是循环不变量规则。

写二分法，区间的定义一般为两种，左闭右闭即[left, right]，或者左闭右开即[left, right)。
 * 
 */


// 左闭右闭
function search1(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length -1;
  while(left <= right){
      let mid = Math.floor((left + right)/2);
      if(target > nums[mid]){
          left = mid + 1;
      }else if(target < nums[mid]){
          right = mid - 1;
      }else{
          return mid;
      }
  }
  return -1;
};

// 左闭右开
function search2(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length -1;
  while(left < right){
      let mid = Math.floor((left + right)/2);
      if(target > nums[mid]){
          left = mid + 1;
      }else if(target < nums[mid]){
          right = mid;
      }else{
          return mid;
      }
  }
  return -1;
};