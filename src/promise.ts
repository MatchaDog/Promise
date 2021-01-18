type reasonType = string | Error | undefined;
type promiseResolve = (value: any) => void;
type promiseReject = (reason?: reasonType) => void;

type promiseCallback = (resolve: promiseResolve, reject: promiseReject) => void;

type promiseState = "fulfilled" | "pending" | "rejected";

class Promises {
    state: promiseState;
    value: any;
    reason: reasonType;
    onFulfilled: promiseResolve[];
    onRejected: promiseReject[];
    constructor(promiseCb?: promiseCallback) {
        this.state = "pending";
        this.reason;
        this.value;
        this.onFulfilled = [];
        this.onRejected = [];
        try {
            if (promiseCb) promiseCb(this.resolve, this.reject);
            else {
                console.error("Promise resolver undefined is not a function at new Promise");
            }
        } catch (err) {
            if (err instanceof Error) {
                this.reject(err as reasonType);
            }
        }
    }
    resolve(value: any) {
        if (this.state === "pending") {
            this.state = "fulfilled";
            this.value = value;
            this.onFulfilled.forEach((fn) => {
                fn(this.value);
            });
        }
    }
    reject(reason: reasonType): void {
        if (this.state === "pending") {
            this.state = "rejected";
            this.reason = reason;
            this.onRejected.forEach((fn) => {
                fn(this.reason);
            });
        }
    }
    /**
     * @description: then() 方法返回一个 Promise。它最多需要有两个参数：Promise 的成功和失败情况的回调函数。
     * @param {promiseResolve} onFulfilled 当 Promise 变成接受状态（fulfilled）时调用的函数。该函数有一个参数，即接受的最终结果（the fulfillment  value）。如果该参数不是函数，则会在内部被替换为 (x) => x，即原样返回 promise 最终结果的函数
     * @param {promiseReject} onRejected 当 Promise 变成拒绝状态（rejected）时调用的函数。该函数有一个参数，即拒绝的原因（rejection reason）。  如果该参数不是函数，则会在内部被替换为一个 "Thrower" 函数 (it throws an error it received as argument)。
     * @return {Promises}
     */
    then(onFulfilled: promiseResolve, onRejected: promiseReject): Promises {
        if (typeof onFulfilled !== "function") {
            onFulfilled = (x: any) => x;
        }
        if (typeof onRejected !== "function") {
            onRejected = (x: reasonType) => {
                throw x;
            };
        }
        if (this.state === "fulfilled") {
            return new Promises((_, rej) => {
                try {
                    setTimeout(() => {
                        onFulfilled(this.value);
                    });
                } catch (err) {
                    rej(err);
                }
            });
        } else if (this.state === "rejected") {
            return new Promises((_, rej) => {
                try {
                    setTimeout(() => {
                        onRejected(this.reason);
                    });
                } catch (err) {
                    rej(err);
                }
            });
        } else {
            return new Promises((_, rej) => {
                this.onFulfilled.push(() => {
                    try {
                        onFulfilled(this.value);
                    } catch (err) {
                        rej(err);
                    }
                });
                this.onRejected.push(() => {
                    try {
                        onRejected(this.reason);
                    } catch (err) {
                        rej(err);
                    }
                });
            });
        }
    }
}

export default Promises;
