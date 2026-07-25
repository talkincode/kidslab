# solar-explorer 知识断言

## 适用范围

- 课件使用 NASA/JPL 的长期近似开普勒轨道要素 Table 2a/2b，适用于公元前 3000 年至公元 3000 年；它不是 JPL Horizons 高精度数值历表，地球位置使用地月质心要素近似。
- 模型计算八大行星的日心 J2000 黄道坐标，不包含卫星、矮行星、小天体、行星间摄动、相对论修正或太阳绕银河系的完整曲线轨道。
- “邻居之间”把太阳相对本地静止标准的本动近似成匀速直线；“绕银心”用 230 km/s 的代表值和银河自转方向近似，并为教学清晰度忽略约 18 km/s 的太阳本动分量。
- 天体显示半径使用平方根映射来保持大小排序但增强可见性；“压缩视图”对日心距离做平方根映射；“螺距缩放”只压缩太阳平移距离。档案中的直径、距离、周期和速度数值不使用这些显示映射。
- 星空、行星表面纹理、光晕和轨道线是程序化教学视觉，不是望远镜影像；行星自转轴姿态用于展示倾斜方向，不模拟岁差或章动。

## 知识断言

- [F1] 课件按 JPL 给出的六个开普勒要素及其世纪变率求值，解开普勒方程 M=E−e sinE，再把轨道平面坐标旋转到 J2000 黄道坐标；木星至海王星还加入 Table 2b 的长期修正项。[S1]
- [F2] JPL 将这组长期要素标为公元前 3000 年至公元 3000 年的低精度近似，并明确说明需要高精度时应使用 Horizons；课件因此在该时间边界自动暂停。[S1]
- [F3] 课件显示的行星赤道半径、恒星自转周期和恒星公转周期采用 JPL Planetary Physical Parameters；负自转周期表示逆行自转。[S2]
- [F4] 行星轨道是以太阳为焦点的近椭圆而非正圆，沿轨道的速度会变化；八大行星中水星的轨道偏心率最大，火星第二。[S1] [S3]
- [F5] 水星约 88 天绕日一圈、约 58.6 天相对恒星自转一圈；由于 3∶2 自旋轨道共振，一个正午到下一个正午约需 176 个地球日。[S2] [S4]
- [F6] 太阳约占太阳系总质量的 99.86%，其引力主导八大行星的日心轨道。[S5]
- [F7] Schönrich、Binney 与 Dehnen 给出的太阳相对本地静止标准速度分量为 (U,V,W)=(11.1,12.24,7.25) km/s，合速度约 18.0 km/s；课件“邻居之间”参考系使用这组数值。[S6]
- [F8] 太阳系绕银河系一圈约需 2.3–2.4 亿年；课件“绕银心”采用约 230 km/s（828,000 km/h）的代表性切向速度，表示太阳与行星共同绕银心运动，而不是把银河运动当成额外的日心引力。[S7] [S11]
- [F9] 按 IAU 的 1 au 精确定义换算，230 km/s 约等于 48.5 au/年，因此地球每绕日一圈时太阳已经前进约 48.5 au；真实螺距远大于 1 au 的地球轨道半径，课件必须压缩螺距才能在同一画面看清线圈。[S8]
- [F10] 课件用 IAU SOFA 的 ICRS/银道坐标定义和 J2000 黄赤交角换算银河自转方向，得到它与黄道面的夹角约 59.6°；所以真实教学示意应是斜螺旋，不是轨道面与前进方向成 90°、行星拖在太阳身后的“漩涡”画法。[S1] [S9]
- [F11] 把同一个太阳平移向量同时加到太阳和全部行星，不改变任一行星相对太阳的位置；“课本视角”和两个移动参考系展示的是同一组日心轨道在不同参考系中的轨迹。[S10]

## 来源

- [S1] NASA/JPL Solar System Dynamics：《Approximate Positions of the Planets》；https://ssd.jpl.nasa.gov/planets/approx_pos.html
- [S2] NASA/JPL Solar System Dynamics：《Planetary Physical Parameters》；https://ssd.jpl.nasa.gov/planets/phys_par.html
- [S3] OpenStax：《Astronomy 2e》Appendix F, Physical and Orbital Data for the Planets；https://openstax.org/books/astronomy-2e/pages/f-physical-and-orbital-data-for-the-planets
- [S4] NASA Science：Mercury；https://science.nasa.gov/mercury/
- [S5] Natural History Museum：《The Sun》；https://www.nhm.ac.uk/discover/factfile-the-sun.html
- [S6] Schönrich, Binney & Dehnen (2010)：《Local kinematics and the local standard of rest》，MNRAS 403, 1829–1833；https://doi.org/10.1111/j.1365-2966.2010.16253.x
- [S7] NASA Science：《Galaxies - Our Milky Way》；https://science.nasa.gov/universe/galaxies/
- [S8] IAU 2012 Resolution B2：《Re-definition of the astronomical unit of length》；https://www.iau.org/static/resolutions/IAU2012_English.pdf
- [S9] IAU Standards of Fundamental Astronomy：SOFA Astrometry Tools, Galactic Coordinates；https://www.iausofa.org/current_C.html
- [S10] OpenStax：《University Physics Volume 1》5.2 Newton's First Law（惯性参考系）；https://openstax.org/books/university-physics-volume-1/pages/5-2-newtons-first-law
- [S11] NASA/GSFC StarChild：《Does the Sun move around the Milky Way?》；https://starchild.gsfc.nasa.gov/docs/StarChild/questions/question18.html
