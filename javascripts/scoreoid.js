var strJSON = '{"result":true,"count":1}';
var objJSON = eval("(function(){return " + strJSON + ";})()");
alert(objJSON.result);
alert(objJSON.count);