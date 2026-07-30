# ice-bridges 知识断言

## 适用范围
- 课件只讨论有限、无向、连通图；陆地抽象为顶点，桥抽象为边。
- 玩法目标是每座桥恰好经过一次；不讨论有向图、加权图或欧拉路径算法的效率。

## 知识断言
- [F1] 顶点的度数等于与该顶点相接的边数；课件把一块陆地连接的桥数显示为该点的度数。[S1]
- [F2] 连通图存在经过每条边恰好一次的欧拉路径，当且仅当奇度顶点不超过两个；恰有两个奇度顶点时，路径必须从一个奇点出发、在另一个奇点结束。[S2]
- [F3] 连通图存在欧拉回路，当且仅当没有奇度顶点；欧拉回路使用每条边恰好一次并回到起点。[S3]
- [F4] 七桥模型的四块陆地度数分别为 3、3、5、3，因而有四个奇度顶点，不存在经过七座桥各一次的路线。[S1][S2]

## 来源
- [S1] Wolfram MathWorld, “Vertex Degree” (degree is the number of incident graph edges), https://mathworld.wolfram.com/VertexDegree.html
- [S2] Wolfram MathWorld, “Eulerian Path” (a connected graph has an Eulerian path iff it has at most two odd-degree vertices), https://mathworld.wolfram.com/EulerianPath.html
- [S3] Wolfram MathWorld, “Eulerian Cycle” (a connected graph has an Eulerian cycle iff it has no odd-degree vertices), https://mathworld.wolfram.com/EulerianCycle.html
