# statistics-sampling-lab 知识断言

## 适用范围

- 覆盖有限总体的简单随机抽样（不放回）、按规模比例分层抽样、整群抽样（每次抽 1 个街区再在该街区内抽 n 人）和便利抽样。
- 总体是课件内的「星河城」：N = 400 名居民，四区各 100 人，个人属性是每周通勤时间（分钟）。四区均值固定为 12、24、36、48，全市均值精确为 30。这是教学用合成总体，不是真实城市调查。
- 样本标准差用无偏公式 s = √[Σ(xᵢ − x̄)² / (n − 1)]。简单随机抽样的标准误使用有限总体校正：SE = (s/√n) · √[(N − n)/(N − 1)]。
- 约 95% 区间写成 x̄ ± 1.96 SE，这是 n 较大、近似正态时的常用区间，不是精确的 t 区间，也不覆盖非概率抽样的真实覆盖率。
- 三维城市、发光小人与液晶读数是示意；测量噪声默认关闭，同一种子与抽次得到同一批人。对错反馈只服务空记录、重复记录和非法样本量，不是考卷。
- 不覆盖系统抽样、PPS、复杂分层标准误的完整公式、假设检验或贝叶斯推断。

## 知识断言

- [F1] 有限总体均值 μ = (1/N) Σ xᵢ。本课合成总体 N = 400，四区人数相等且区均值分别为 12、24、36、48 分钟，因此 μ = 30 分钟精确成立。[S1][S4]
- [F2] 简单随机抽样（不放回）使每个大小为 n 的子集被抽到的概率相同。此时样本均值 x̄ 是 μ 的无偏估计：E[x̄] = μ。[S1][S2]
- [F3] 按规模比例分层时，第 h 层抽取 nₕ = n · (Nₕ / N) 人，再把各层样本合并。各层人数相等时即每层 n/4 人。该估计量对 μ 仍无偏，并且通常比同样 n 的简单随机抽样更稳。[S1][S2]
- [F4] 整群抽样先抽群（本课每次抽 1 个街区），再调查该群内的个体。若群与群之间均值差很大，整群估计的波动会明显大于简单随机抽样。[S1][S2]
- [F5] 便利抽样只调查容易碰到的人。本课便利样本全部来自市中心，E[x̄] = 12 分钟，偏倚 = 12 − 30 = −18 分钟。重复抽很多份便利样本，均值会挤在 12 附近，看起来很稳，却稳定地估错全市均值。[S2][S3]
- [F6] 样本标准差 s = √[Σ(xᵢ − x̄)² / (n − 1)]，n ≥ 2，单位与观测值相同（分钟）。这是总体标准差的常用无偏估计，不把 n 放在分母。[S1]
- [F7] 不放回简单随机抽样的均值标准误为 SE = (s/√n) · √[(N − n)/(N − 1)]，N > n ≥ 2。当 n 接近 N 时校正项变小；n = N 时 SE = 0（普查）。[S1]
- [F8] 在近似正态且 n 不太小时，x̄ ± 1.96 SE 是约 95% 的置信区间。便利抽样的区间可以很窄，却常常装不进 μ：精度高不等于没有偏倚。[S1][S3]

## 来源

- [S1] OpenStax, *Introductory Statistics 2e*, 2.3 Measures of the Location of the Data；2.7 Measures of the Spread of the Data；7.3 A Confidence Interval for a Population Standard Deviation, Known or Large Sample Size；https://openstax.org/books/introductory-statistics-2e
- [S2] OpenStax, *Introductory Statistics 2e*, 1.2 Data, Sampling, and Variation in Data and Sampling（简单随机、分层、整群、便利抽样与偏倚）；https://openstax.org/books/introductory-statistics-2e/pages/1-2-data-sampling-and-variation-in-data-and-sampling
- [S3] OpenStax, *Introductory Statistics 2e*, 1.3 Frequency, Frequency Tables, and Levels of Measurement 与抽样误差讨论：非概率样本不能保证区间覆盖总体参数。
- [S4] 中华人民共和国教育部：《普通高中数学课程标准（2017年版2020年修订）》「概率与统计」中简单随机抽样、分层抽样与用样本估计总体的学业要求；人民教育出版社《普通高中教科书 数学 选择性必修 第三册》统计。
