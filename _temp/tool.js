var str="{jkl:334}";

var json = (new Function('return ' + str + ';'))();
console.log(json);

// 将不合法JSON转为合法JSON