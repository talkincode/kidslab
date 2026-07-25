# pixel-post 知识断言

## 适用范围

- 面向小学三至五年级，以 8×8 黑白像素图介绍栅格图像的像素表示、按固定顺序用 0/1 表示两种颜色，以及行程长度编码（RLE）。
- 仅讨论每像素两种状态的未压缩位图和逐行 RLE；不覆盖 RGB 颜色通道、文件格式、熵编码、有损压缩或跨行编码差异。

## 知识断言

- [F1] 数字图像可以表示为规则网格中的像素集合；每个像素在网格中有固定位置，并记录一个颜色值。[S1]
- [F2] 对只有两种颜色的像素图，可以约定用 0 和 1 分别表示两种颜色，再按双方一致的扫描顺序把图像表示为数字序列。[S1]
- [F3] 行程长度编码会把连续重复的数据值表示为“重复次数和值”；例如 00001111 可表示为 4×0、4×1。[S2]
- [F4] RLE 对包含长串重复值的数据通常更有效；数据频繁变化时，编码结果可能不会变短，甚至可能比原数据更长。[S2]

## 来源

- [S1] CS Unplugged, “Image Representation”, describing images as grids of pixels represented by numbers: https://www.csunplugged.org/en/topics/image-representation/
- [S2] Shah, et al., “Selective Run-Length Encoding,” definition of RLE and its possible size inflation when consecutive repeated elements are absent: https://arxiv.org/abs/2312.17024
