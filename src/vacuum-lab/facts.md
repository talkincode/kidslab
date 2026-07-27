# vacuum-lab 知识断言

## 适用范围

- 面向小学三至四年级，用离散方格中的简化机器人比较覆盖策略，不模拟真实电机、传感器误差、电量或连续空间运动。
- 课件里的覆盖率、用时与碰撞次数是三个固定实验户型中的可复现实验结果，不代表某种策略在所有真实房间中的普遍排名。

## 知识断言

- [F1] 覆盖路径规划的目标是在避开障碍的同时，让机器人路径经过自由空间中所有需要覆盖的位置。[S1]
- [F2] Boustrophedon（牛耕式）覆盖把空间分成区域，并在区域内使用往返扫掠路径完成覆盖；课件把这种儿童可见的往返规则称为“弓字清扫”。[S2]
- [F3] 覆盖算法可以从是否完整覆盖、路径长度、重复覆盖和转向等指标进行比较；因此课件同时展示覆盖率、用时和碰撞，而不只看一个数字。[S1]

## 来源

- [S1] Howie Choset, “Coverage for robotics — A survey of recent results,” *Annals of Mathematics and Artificial Intelligence*, 31, 113–126 (2001), DOI: https://doi.org/10.1023/A:1016639210559
- [S2] Howie Choset, “Coverage of Known Spaces: The Boustrophedon Cellular Decomposition,” *Autonomous Robots*, 9, 247–253 (2000), DOI: https://doi.org/10.1023/A:1008958800904
