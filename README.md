#Broadcast

simple events broadcasting using list of callbacks

methods:
 `on, off, one, trig, aTrig, clean, events, getAllEvents`
 
Rules for how to use:
 
- messages can be with any symbol, except ".", because it is identifier for namespace
- namespace MUST BE start from "." symbol. it's for separate from messages
- maximum arguments for .trig() = 3, if you need more arguments for send data, use object structures

examples:

```
// will create group of events with collision detect
var eventsGroup = broadcast.events('my-group', {
    myEv1: 'myEv1',
    myEv2: 'myEv2'
})


var eventsGroup2 = broadcast.events('my-group-2', {
    myEv1: 'myEv1',
    myEv2: 'myEv2'
})

broadcast.trig(evs.myEv1, opt1, opt2); - will trigger message with arguments

// will return evs group
var evs = broadcast.events('my-group');

// bind handler to evs.myEv1 = 'my-group' trigger
broadcast.on(evs.myEv1, function(params){
  console.log(params.params1); //see 'ohh now'
});

```

```
// 'myHandler' will call only once
broadcast.one('my-event', '.my-namespace', myHandler);

// bind to different messages to 'myHandler'
broadcast.on(['my-event1', 'my-event2'], '.my-namespace', myHandler);


// unbind all callbacks from MESSAGE
broadcast.off('my-event');

unbind all callbacks from NAMESPACE
broadcast.off('.namespace');

// will trigger immedially from current point
broadcast.trig('my-event', {param1: 'ohh now', param2: 2}); // or without params

// will trigger after current callstack is done
broadcast.aTrig('my-event', params);
```

licence: MIT, dudiq 2012

