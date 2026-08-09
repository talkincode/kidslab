# packet-knights 知识断言

## 适用范围
- 面向小学高年级的互联网分组、路由、拥塞与容错直觉；路线长度和自动改道均为教学化模型。
- 不教授具体路由协议配置、真实链路带宽计算、IP 分片细节或 TCP 拥塞控制算法。

## 知识断言
- [F1] 互联网层把数据作为独立数据报传送；每个数据报携带用于转发的头部信息，可以独立经过网络。[S1]
- [F2] TCP 使用序列号标识数据顺序，接收方可据此按正确顺序重组数据，并确认缺失的数据。[S2]
- [F3] 路由器根据转发表决定数据报的下一跳；网络拓扑或可达性变化后，路由信息可以更新，从而选择仍可达的路径。[S3]
- [F4] 网络拥塞可能增加排队时延并造成数据包丢失；发现丢失后，可靠传输机制会重传缺失数据。[S2][S4]
- [F5] 课件中的“最短路线”是带非负边权图上的最小总权重路径；Dijkstra 算法可求这类单源最短路径。[S5]

## 来源
- [S1] IETF, RFC 8200, *Internet Protocol, Version 6 (IPv6) Specification*, Sections 3–4. https://www.rfc-editor.org/rfc/rfc8200
- [S2] IETF, RFC 9293, *Transmission Control Protocol (TCP)*, Sections 3.3.1–3.5. https://www.rfc-editor.org/rfc/rfc9293
- [S3] IETF, RFC 1812, *Requirements for IP Version 4 Routers*, Sections 5.2 and 7.1. https://www.rfc-editor.org/rfc/rfc1812
- [S4] IETF, RFC 5681, *TCP Congestion Control*, Sections 2–3. https://www.rfc-editor.org/rfc/rfc5681
- [S5] Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms*, 4th ed., Section 22.3, Dijkstra's algorithm.
