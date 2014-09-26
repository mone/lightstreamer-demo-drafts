var requirejs = require('requirejs');

requirejs.config({
    deps: ["lightstreamer.js", "lightstreamer-jms.js"],
    nodeRequire: require
});

requirejs(["TopicConnectionFactory"], function(TopicConnectionFactory) {
  
  TopicConnectionFactory.createTopicConnection("http://localhost:8080", "JMS", "HornetQ",null,null,{
    onConnectionCreated: function(conn) {
      // Connection succeeded, topic subscription
      var topicSession= conn.createSession(false, "PRE_ACK");
      var topic= topicSession.createTopic("chatTopic");
      var consumer= topicSession.createConsumer(topic, null);
      var producer = topicSession.createProducer(topic, null);
      
      // Add a listener to the message consumer
      consumer.setMessageListener({
        onMessage: function(message) {
          // Message received
          console.log("received: " + message.getText());
        }
      });
  
      // Start the connection
      conn.start();
  
      //setup stdio to read from console
      process.stdin.resume();
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', function (text) {
        text = text.replace(/[\r\n\f]/g,"");
        //create and send a message from the console input
        var message = topicSession.createTextMessage(text);
        producer.send(message);
      });
  
    }, 
    onConnectionFailed: function(errorCode, errorMessage) {
      // Connection failed, show the error
      console.log("Error: " + errorCode + " " + errorMessage);
    }
  });
  
});

