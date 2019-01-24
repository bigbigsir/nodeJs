/**
 * Created by: MoJie
 * Date: 2019/1/24
 */

module.exports = {
    isObject(target) {
        return Object.prototype.toString.call(target) === '[object Object]';
    }
};