# robo-pet-school 知识断言

## 适用范围
- 课件面向小学五至六年级，用“球 / 不是球”的二分类游戏介绍监督学习中的带标签样本、泛化、误判和训练数据偏差。
- 课件中的置信度是为了帮助孩子比较“更确定 / 更犹豫”的教学可视化，不代表真实机器学习系统的校准概率；游戏使用固定教学模型，不教授具体算法公式。

## 知识断言
- [F1] 监督学习使用带有正确答案（标签）的示例来学习输入与目标输出之间的关系；分类模型的输出是离散类别。[S1][S2]
- [F2] 训练集用于拟合模型，而测试集应使用未参与训练的样本来评估模型对新数据的表现；这种对新样本仍能作出有用预测的能力称为泛化。[S1][S3]
- [F3] 训练数据如果不能充分代表模型将遇到的真实情况，模型在未被充分代表的群体或情形上可能表现较差；补充更多且更有代表性的样本能帮助发现和减少这类问题，但不能保证消除所有偏差。[S4]
- [F4] 只看训练样本上的成绩不能证明模型已经学会可推广的规律，因此课件把训练样本与公园里的新物体分开呈现。[S1][S3]

## 来源
- [S1] Google for Developers, Machine Learning Crash Course, “Datasets, generalization, and overfitting”, https://developers.google.com/machine-learning/crash-course/overfitting/generalization
- [S2] Google for Developers, Machine Learning Glossary, “classification model” and “label”, https://developers.google.com/machine-learning/glossary
- [S3] NIST, AI Risk Management Framework 1.0, Appendix A, “Test, Evaluation, Verification, and Validation (TEVV)”, https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf
- [S4] NIST Special Publication 1270, “Towards a Standard for Identifying and Managing Bias in Artificial Intelligence”, Sections 3–4, https://doi.org/10.6028/NIST.SP.1270
