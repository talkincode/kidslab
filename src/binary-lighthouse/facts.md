# binary-lighthouse 知识断言

## 适用范围

- 面向小学四至六年级的无符号二进制入门，使用 5 个二进制位表示整数，并用 A=1 至 Z=26 的课件内约定编码大写英文字母。
- 覆盖二进制位值、二进制与十进制互读及固定码表编码；不覆盖负数、补码、ASCII、Unicode 或纠错码。

## 知识断言

- [F1] 二进制数的每一位只有 0 和 1 两种状态；从右向左，各位的位值依次为 1、2、4、8、16，即 2 的连续整数次幂。[S1]
- [F2] 一个二进制数的十进制值，等于所有值为 1 的数位对应位值之和；例如 10011 表示 16+2+1=19。[S1]
- [F3] 5 个二进制位共有 2^5=32 种不同组合，可以无符号地表示 0 至 31。[S1]
- [F4] 数字、文字等不同信息都可以按约定编码成位模式；本课件使用 A=1、B=2、…、Z=26 的自定义码表，不将其称为 ASCII。[S2]

## 来源

- [S1] CS Unplugged, “How binary digits work”, Binary Numbers topic: https://www.csunplugged.org/en/topics/binary-numbers/how-binary-digits-work-junior/
- [S2] Code.org, “Binary Bracelets”, Course C lesson plan, teaching that information can be represented with binary patterns: https://studio.code.org/courses/coursec-2024/units/1/lessons/16
