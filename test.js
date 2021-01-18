/**
 * @Author: Hans
 * @Date: 2021-01-18 15:19:51
 * @LastEditTime: 2021-01-18 15:21:28
 * @LastEditors: Do not edit
 * @FilePath: /Promise/test.js
 * @Description:
 */
const Promise = require("./lib/promise").default;

module.exports = {
    deferred() {
        var resolve;
        var reject;
        var promise = new Promise(function (res, rej) {
            resolve = res;
            reject = rej;
        });
        return {
            promise,
            resolve,
            reject,
        };
    },
};
