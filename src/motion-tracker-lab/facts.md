# motion-tracker-lab 知识断言

## 适用范围

- 本课件只处理一维直线运动。水平轨道为匀速，斜面为无摩擦的匀加速；不包含空气阻力、滚动摩擦、打滑或二维抛体。
- 录像是按固定时间间隔 Δt = 0.10 s 生成的教学动画，不是真实摄像机噪声。位置、速度和加速度都是模型值。
- 重力加速度取 g = 9.80 m/s²，斜面角 θ 从水平面量起，范围 0°–90°。不能把 a = g sinθ 直接用到有摩擦或非刚性轨道。

## 知识断言

- [F1] 平均速度定义为位移与所用时间的比：v = Δs/Δt；本课件用相邻两打点的 Δs 与 Δt = 0.10 s 计算区间平均速度，单位为 m/s。[S1]
- [F2] 匀速直线运动的 s-t 图像是一条斜率等于速度的直线，v-t 图像是一条平行于时间轴的水平线。[S1] [S4]
- [F3] 加速度恒定时，瞬时速度与时间满足 v = v₀ + at，位移满足 s = s₀ + v₀ t + (1/2) a t²；公式只在加速度恒定且取同一直线正方向时成立。[S2] [S3]
- [F4] v-t 图像的斜率等于加速度。把各区间平均速度画在对应时间中点上，再用最小二乘拟合，得到的斜率就是本课件使用的加速度读数。[S2] [S4]
- [F5] 无摩擦斜面上，沿斜面向下的加速度为 a = g sinθ，其中 θ 是斜面与水平面的夹角，g = 9.80 m/s²。θ = 30° 时 a = 4.90 m/s²。[S5]
- [F6] 本课件水平录像的速度恒为 0.40 m/s；30° 斜面录像从静止释放，加速度为 4.90 m/s²。这些是教学模型里的给定值，不是某次真实实验的测量结果。[S3] [S5]

## 来源

- [S1] OpenStax: *College Physics 2e*, 2.3 Time, Velocity, and Speed；https://openstax.org/books/college-physics-2e/pages/2-3-time-velocity-and-speed
- [S2] OpenStax: *College Physics 2e*, 2.4 Acceleration；https://openstax.org/books/college-physics-2e/pages/2-4-acceleration
- [S3] OpenStax: *College Physics 2e*, 2.5 Motion Equations for Constant Acceleration in One Dimension；https://openstax.org/books/college-physics-2e/pages/2-5-motion-equations-for-constant-acceleration-in-one-dimension
- [S4] OpenStax: *College Physics 2e*, 2.8 Graphical Analysis of One-Dimensional Motion；https://openstax.org/books/college-physics-2e/pages/2-8-graphical-analysis-of-one-dimensional-motion
- [S5] OpenStax: *College Physics 2e*, 5.1 Friction（无摩擦斜面的重量分解 a = g sinθ）；https://openstax.org/books/college-physics-2e/pages/5-1-friction
