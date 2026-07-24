# electric-mouse 知识断言

## 适用范围
- 覆盖稳态直流、近似欧姆型负载、串并联、功率、断路、短路和基础过流保护。
- 不覆盖交流、电容、电感、半导体非线性、真实灯丝温度曲线或保护器件选型。
- 课件中的亮度、转速、响度和热量累计是帮助观察因果关系的简化模型，不是实验室级器件仿真。

## 知识断言
- [F1] 对电阻近似不随工作点变化的欧姆型元件，电压、电流与电阻满足 `V = IR`；其中电压单位为伏特（V）、电流单位为安培（A）、电阻单位为欧姆（Ω）。[S1]
- [F2] 串联支路中各元件通过同一电流，总电阻等于各电阻之和；并联支路两端电压相同，总电流等于各支路电流之和。[S2]
- [F3] 直流电阻负载消耗的电功率可写为 `P = VI`，结合欧姆定律也可写为 `P = I²R` 或 `P = V²/R`，功率单位为瓦特（W）。[S3]
- [F4] 断路没有完整导电路径，因此不能维持回路电流；低电阻短路会产生很大的电流，并可能造成过热或损坏。[S1][S4]
- [F5] 保险丝在过大电流产生的热作用下熔断，需要更换；断路器在过流时打开电路，排除故障后通常可以复位。[S4]

## 来源
- [S1] OpenStax, *University Physics Volume 2*, 9.4 “Ohm's Law”. https://openstax.org/books/university-physics-volume-2/pages/9-4-ohms-law
- [S2] OpenStax, *College Physics 2e*, 21.1 “Resistors in Series and Parallel”. https://openstax.org/books/college-physics-2e/pages/21-1-resistors-in-series-and-parallel
- [S3] OpenStax, *Physics*, Chapter 19 Section Summary（Electrical Power）. https://openstax.org/books/physics/pages/19-section-summary
- [S4] OpenStax, *College Physics 2e*, 20.6 “Electric Hazards and the Human Body”. https://openstax.org/books/college-physics-2e/pages/20-6-electric-hazards-and-the-human-body
