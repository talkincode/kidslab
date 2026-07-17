# pendulum-lab 知识断言

## 适用范围

- 课件模拟理想单摆：摆球视为质点，摆线质量可忽略且长度不变，忽略空气阻力与支点摩擦，局部重力加速度 g 视为常量。
- 摆长 L 的范围为 0.40–3.00 m，初始摆角可在约 ±83° 内选择；显示的 2π√(L/g) 只作小角近似。
- 星球按钮使用参考重力数值，不表示各星球所有位置的真实重力，也不表示木星存在可安装单摆的固体表面。

## 知识断言

- [F1] 理想单摆的非线性运动方程为 θ''=−(g/L)sinθ；课件按该方程进行数值仿真。[S1]
- [F2] 当摆角较小、角度以弧度表示且 sinθ≈θ 时，周期近似为 T≈2π√(L/g)；课件以约 15° 作为小角提示边界。[S1]
- [F3] 在理想单摆模型中，周期与摆球质量无关；摆角较大时，实际非线性周期比小角公式预测值长。[S1]
- [F4] T 的单位为秒，L 是悬点到摆球质心的距离、单位为米，g 的单位为 m/s²。[S1] [S2]
- [F5] 课件采用地球 9.81、月球 1.62、火星 3.71、木星 24.79 m/s² 作为参考重力；这些是约值或特定参考位置的值。[S2] [S3] [S4]
- [F6] “仿真测得周期”来自非线性方程的数值积分与同方向过零计时，不是现实器材的实验测量；数值误差会受积分步长影响。[S1]

## 来源

- [S1] OpenStax：《University Physics Volume 1》15.4 Pendulums；https://openstax.org/books/university-physics-volume-1/pages/15-4-pendulums
- [S2] NIST：《Guide for the Use of the International System of Units (SI)》与标准重力说明；https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8
- [S3] NASA/JPL：Planetary Physical Parameters；https://ssd.jpl.nasa.gov/planets/phys_par.html
- [S4] NASA：Earth's Moon In Depth，月面重力约为地球六分之一；https://solarsystem.nasa.gov/moons/earths-moon/in-depth.amp
