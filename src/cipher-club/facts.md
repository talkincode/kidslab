# cipher-club 知识断言

## 适用范围
- 课件面向小学五至六年级，用英文字母 A-Z 演示凯撒移位密码、反向移位解密和基础字母频率分析。
- 课件只讨论教学用的经典密码，不把凯撒密码描述为能保护现代通信的安全加密；频率分析关卡使用刻意设计的英文样本，不声称每段短文本都以 E 为最高频字母。

## 知识断言
- [F1] 凯撒密码把明文中的每个字母按同一个固定位移替换为另一个字母，并在字母表末尾循环回到开头。[S1]
- [F2] 使用相同位移量向相反方向移动，可以把凯撒密文还原为明文；因此知道位移量就是知道该教学示例中的钥匙。[S1]
- [F3] 单表替换密码会保留原文语言的统计特征，分析密文中字母或字母组合的出现频率可以帮助推测替换关系；但文本越短，频率波动通常越大。[S2][S3]
- [F4] 在一般英文文本中 E 往往是最常见字母，但它不是每一段英文文本中必然出现最多的字母；课件只把 E 作为对给定样本的首个合理猜测。[S2][S3]

## 来源
- [S1] Encyclopaedia Britannica, “Caesar cipher”, fixed alphabet shifts and wraparound substitution, https://www.britannica.com/topic/Caesar-cipher
- [S2] Encyclopaedia Britannica, “Cryptology: Cryptanalysis”, frequency analysis of monoalphabetic substitutions, https://www.britannica.com/topic/cryptology/Cryptanalysis
- [S3] NIST Dictionary of Algorithms and Data Structures, “frequency analysis”, statistical variation and language-frequency use in cryptanalysis, https://xlinux.nist.gov/dads/HTML/frequencyAnalysis.html
