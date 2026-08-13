# pirate-scales 知识断言

## 适用范围

- 课件覆盖用等臂天平在有限次称量中找出假币的推理：默认假币比真币更轻；进阶关允许假币更轻或更重，但只有一枚假币。
- 讨论的是离散信息决策（每次称量三种结果：左重、右重、平衡），不涉及弹簧秤读数、质量连续测量或概率估计。
- 不要求学生写出信息论公式；「一次排除三分之二」以可操作的三分法称量呈现。

## 知识断言

- [F1] 等臂天平一次称量有且仅有三种互斥结果：左边更重、右边更重、两边一样重（平衡）。[S1]
- [F2] 在「只有一枚假币且已知假币更轻」的设定下，把当前嫌疑币尽量均分成三组：左盘、右盘、不放上天平。称量后：若左轻则假币在左盘，若右轻则假币在右盘，若平衡则假币在未称组；嫌疑规模大约变为原来的三分之一。[S1][S2]
- [F3] 因为每次称量有 3 种结果，理论上 \(k\) 次称量最多区分 \(3^k\) 种互斥可能。因此在「假币更轻」时，2 次称量足以在至多 9 枚币中定位假币，3 次称量足以在至多 27 枚币中定位假币。[S2]
- [F4] 若假币可能更轻也可能更重，则每枚币对应两种可能，12 枚币共 24 种可能；因为 \(3^3 = 27 \ge 24\)，存在至多 3 次称量的策略可以找出假币并判断它是轻还是重。[S2][S3]

## 来源

- [S1] 人民教育出版社《义务教育教科书·数学》五年级上册相关思考题中常见的等臂天平设定：一次称量比较两边轻重，结果为三种。
- [S2] Wolfram MathWorld, “Balance Puzzle” (ternary information from a balance scale; classic 12-coin and lighter-only variants), https://mathworld.wolfram.com/BalancePuzzle.html
- [S3] Wikipedia, “Balance puzzle” (12 balls problem: find the odd ball and determine whether it is heavier or lighter in three weighings), https://en.wikipedia.org/wiki/Balance_puzzle
