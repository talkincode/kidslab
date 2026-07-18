# wizard-jars 知识断言

## 适用范围

- 覆盖命令式程序中变量的读取、赋值、顺序更新，以及借助临时变量交换两个值。
- 不覆盖变量作用域、数据类型、并发更新、引用语义或特定编程语言的声明语法。

## 知识断言

- [F1] 赋值会先计算等号右边的表达式，再把计算结果存入等号左边的变量；因此 `coins = coins + 5` 会读取旧值、加 5，再更新 `coins`。[S1]
- [F2] 顺序脚本中的后一行读取变量时，会读到前一行赋值后的新值；因此课件里怒气依次从 10 变成 7，再由 `7 + 7` 变成 14。[S1][S2]
- [F3] 依次执行 `temp = red`、`red = blue`、`blue = temp` 可以交换 `red` 与 `blue` 的值，因为 `temp` 在第一个值被覆盖前保存了它。[S1]

## 来源

- [S1] MDN Web Docs, “Assignment (=)”: the assignment operator evaluates the right operand and assigns the result to the left operand. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Assignment
- [S2] ECMAScript Language Specification, “The Assignment Operators”: evaluation obtains the right-hand value before applying the assignment to the left-hand reference. https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-assignment-operators
