# pyramid-cube 知识断言

## 适用范围
- 覆盖：标准三阶金字塔魔方（Pyraminx）的结构零件、顶点转动、四色面还原目标，以及初级层先式还原思路。
- 不覆盖：竞速公式全集、最少步最优解证明、带轴心机械拆装细节、四阶/镜面等异型金字塔变体。

## 知识断言
- [F1] 标准三阶金字塔魔方外形是正四面体，共有 4 个三角形面；还原目标是每个面只剩同一种颜色。[S1]
- [F2] 本课件四色为蓝、红、黄、绿，一面一色；与常见六色立方体魔方不同，金字塔没有“对面色”成对关系。[S1]
- [F3] 可转动零件主要包括：4 个尖角（tips）、4 个轴心中心块（axial centers）、6 条棱块（edges）。尖角转动不影响其他零件的相对排列，属于平凡步骤。[S1][S2]
- [F4] 有效操作是绕四个顶点之一旋转 120° 或 240°。浅层只转尖角；深层会带动该顶点处的中心块，并循环相邻的三条棱。[S1][S2]
- [F5] 初级还原思路可以分层：先摆正尖角 → 摆正中心块颜色朝向 → 再把棱块送回正确位置与朝向，使每个面颜色一致。[S2]
- [F6] 任意合法打乱都可以通过“把做过的转动反向做回去”还原；这是可逆群操作的直接结果，适合作为演示与提示的可靠兜底。[S3]

## 来源
- [S1] Jaap Scherphuis, *Pyraminx* puzzle page — piece types, face count, and turn model. https://www.jaapsch.net/puzzles/pyraminx.htm
- [S2] World Cube Association, Pyraminx regulations & common beginner method outline (tips → centers → edges). https://www.worldcubeassociation.org/regulations/
- [S3] Basic group theory of twisty puzzles: each move is invertible; the inverse sequence of a scramble restores the solved state (see also standard puzzle theory notes accompanying [S1]).
