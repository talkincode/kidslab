# combo-closet 知识断言

## 适用范围

- 覆盖两个有限选择集合的简单搭配计数：每套搭配恰好选择一顶帽子和一件上衣。
- 假设每顶帽子都能与每件上衣搭配；不覆盖有限制条件、重复物品、排列顺序或三类以上物品的组合问题。

## 知识断言

- [F1] 如果有 `h` 顶不同的帽子，每顶帽子都能搭配 `t` 件不同的上衣，那么不重复搭配的总数是 `h × t`。[S1]
- [F2] 树状图可以按第一类选择分出 `h` 根主枝，再让每根主枝分出 `t` 个结果；末端结果共有 `h × t` 个，且每个结果对应一套唯一搭配。[S1]
- [F3] `3 × 4 = 12` 和 `4 × 3 = 12` 都能设计出 12 套搭配；交换两个因数的顺序不会改变乘积。[S2]

## 来源

- [S1] OpenStax, *Contemporary Mathematics*, 7.6 “Basic Counting Principles”, Multiplication Principle. https://openstax.org/books/contemporary-mathematics/pages/7-6-basic-counting-principles
- [S2] Common Core State Standards Initiative, Mathematics Standards, Grade 3, `3.OA.B.5`: apply properties of operations, including the commutative property of multiplication. https://www.thecorestandards.org/Math/Content/3/OA/B/5/
