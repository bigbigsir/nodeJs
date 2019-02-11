/**
 * Created by: MoJie
 * Date: 2019/1/24
 */
'use strict';

module.exports = {
    isObject(target) {
        return Object.prototype.toString.call(target) === '[object Object]';
    }
};