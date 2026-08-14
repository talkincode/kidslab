# cpu-lab 知识断言

## 适用范围

- 面向小学中高年级至初中的计算机组成入门（图表模式），用一张可点击的迷你电脑结构图讲解冯·诺依曼模型，并配合迷你指令集做实验。
- 覆盖：存储器存放程序与数据、CPU 负责运算与控制、总线在部件间传递信息、输入/输出与主机交换、取指-译码-执行循环，以及 LOAD/ADD/STORE/OUT/HALT 等示教级指令语义。
- 不覆盖：流水线、缓存、中断、操作系统、真实汇编语法、二进制机器码编码、多核或外设驱动细节。

## 知识断言

- [F1] 现代通用计算机常按冯·诺依曼结构理解：同一存储器既存放程序指令，也存放数据；CPU 按地址依次取出指令并执行。[S1][S2]
- [F2] CPU（中央处理器）是运算与控制中心：它含有寄存器（暂存操作数/结果）和算术逻辑单元 ALU（完成加减等运算），并通过程序计数器 PC 记住下一条指令的地址。[S1][S3]
- [F3] 总线是连接 CPU、内存与 I/O 的共享通路，用于在部件之间传送地址、数据与控制信号；本课件把总线抽象成“零件之间的数据传送带”。[S1]
- [F4] 一条指令的典型执行过程可拆成取指（Fetch：按 PC 从内存读出指令）、译码（Decode：识别指令含义）、执行（Execute：完成运算或访存等动作）；完成后 PC 通常指向下一条指令，循环往复直到停机。[S2][S3]
- [F5] 在本课件的示教指令集中：`LOAD addr` 把内存地址 `addr` 的值读入累加器 A；`ADD addr` 把内存 `addr` 的值加到 A；`STORE addr` 把 A 写回内存 `addr`；`OUT` 把 A 送到输出设备；`HALT` 结束程序。这些语义用于建立“指令=对机器状态的精确改写”，不等于某一种商业 CPU 的真实编码。[S2][S3]

## 来源

- [S1] Brookshear, J. Glenn & Brylow, Dennis. *Computer Science: An Overview* (13th ed.). Pearson. Ch. 2 “Data Manipulation” / computer architecture overview (CPU, main memory, bus, I/O).
- [S2] Null, Linda & Lobur, Julia. *The Essentials of Computer Organization and Architecture* (5th ed.). Jones & Bartlett. Ch. 4 “MARIE: An Introduction to a Simple Computer” — fetch-decode-execute cycle and simple instruction semantics.
- [S3] CS Unplugged related materials on how computers follow stored instructions: https://www.csunplugged.org/
