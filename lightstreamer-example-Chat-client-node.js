var requirejs = require('requirejs');

requirejs.config({
    deps: ["lightstreamer.js"],
    nodeRequire: require
});

requirejs(["LightstreamerClient","Subscription"],function(LightstreamerClient,Subscription) {
  var lsClient = new LightstreamerClient("http://localhost:8080","DEMO");
  lsClient.connect();
  
  var chatSubscription = new Subscription("DISTINCT","chat_room",["nick","message","timestamp"]);
  chatSubscription.setDataAdapter("CHAT_ROOM");
  chatSubscription.setRequestedSnapshot(5); 
  chatSubscription.addListener({
    onItemUpdate: function(itemUpdate) {
      console.log(itemUpdate.getValue("timestamp") + " " + itemUpdate.getValue("nick") + ": " + itemUpdate.getValue("message"));
    }
  });
  
  lsClient.subscribe(chatSubscription);
  
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', function (text) {
    text = "CHAT|" + text.replace(/[\r\n\f]/g,"");
    lsClient.sendMessage(text);
  });
  

});
