/**
 * @description: 节流函数
 * @param {Function} func 要节流的函数
 * @param {number} delay 延迟时间
 * @return {Function} 节流后的函数
 */


const throttle = (func: Function, delay: number) => {
    let timer = 0;
    return function (...args: any[]) {
        const context = this;
        if (timer) return;
        timer = setTimeout(() => {
            func.apply(context, args);
            timer = 0;
        }, delay);
    };
};