export enum OverflowPolicy {
  ERROR = 'error',
  DROP_HEAD = 'dropHead', //丢弃栈底
  DROP_TAIL = 'dropTail', //丢弃栈顶(刚要push的)
}

export class StackOverflowError extends Error {
  constructor(maxSize:number){
    super(`Stack overflow, max size is ${maxSize}`);
  }
}

export class Stack<T> implements Iterable<T>{
  private _items: T[] = [];
  constructor(
    private _maxSize: number = Infinity,
    private _overflowPolicy: OverflowPolicy = OverflowPolicy.ERROR
  ){}

  // get
  get size(): number {
    return this._items.length;
  }
  // isEmpty
  get isEmpty(): boolean {
    return this._items.length === 0;
  }

  /** 栈顶元素（不移除） */
  peek(): T | undefined {
    return this._items[this._items.length - 1];
  }

  // push
  push(...elements: T[]):number{
    for(const el of elements){
      if(this.size >= this._maxSize){
        switch(this._overflowPolicy){
          case OverflowPolicy.ERROR:
            throw new StackOverflowError(this._maxSize);
          case OverflowPolicy.DROP_HEAD:
            this._items.shift(); // 扔掉栈底
            break;
          case OverflowPolicy.DROP_TAIL:
            continue; // 直接丢弃当前要 push 的元素
        }
      }
      this._items.push(el);
    }
    return this.size;
  }

  /** 出栈 */
  pop(): T | undefined {
    return this._items.pop();
  }

  /** 清空 */
  clear(): void {
    this._items.length = 0;
  }

  /** 从顶到底迭代 */
  [Symbol.iterator](): Iterator<T> {
    let idx = this._items.length - 1;
    return {
      next: (): IteratorResult<T> =>
        idx >= 0
          ? { value: this._items[idx--], done: false }
          : { value: undefined as any, done: true },
    };
  }

   /** 调试用 */
  toString(): string {
    return `Stack [${this._items.join(', ')}]`;
  }
}