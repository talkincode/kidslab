# haunted-events 知识断言

## 适用范围

- 覆盖事件驱动程序中的事件、事件处理器、触发与响应，以及一个响应产生新事件时形成的事件链。
- 不覆盖浏览器事件传播阶段、异步任务队列、并发、事件循环实现细节或特定框架的事件 API。

## 知识断言

- [F1] 事件驱动程序会为某类事件注册处理器；当该事件发生时，对应处理器才会运行。[S1][S2]
- [F2] 不同事件的处理器不需要按书写顺序依次执行，实际响应取决于运行时先发生了哪个事件。[S1]
- [F3] 一个事件处理器可以改变程序状态或引发后续事件，因此多个“触发—响应”连接能够组成事件链。[S1][S2]

## 来源

- [S1] MDN Web Docs, “Introduction to events”: event handlers run in reaction to events and can be registered for specific event types. https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events
- [S2] MDN Web Docs, “EventTarget: addEventListener() method”: listeners are called when an event of the specified type is delivered to the target. https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
