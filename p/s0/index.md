---
layout: page
title: 大家来给SHLUG捐域名费吧～
permalink: /p/s0/
---
<script type="text/javascript" src="/js/jquery-3.3.1.min.js"></script>
<script type="text/javascript" src="default.js"></script>

## 我们现在的情况

目前，SHLUG除了人力外，最大的支出即我们目前持有的shlug.org、shlug.net和shlug.com三个域名的域名费。

前几年一直是托管在GoDaddy上面的，每年的费用需要`¥500`左右，一直由我们SHLUG的“离休干部”geekbone同学个人资助。我觉得，通过社区成员的捐助，而非个人的资助（此处应有感谢），来实现社区的运转，是更为良好和健康的。因此呢，在这里我号召大家捐款来交今年我们LUG的域名费。

哦，忘记说了，由于GoDaddy价格实在感人，今年我们把域名全部迁移到Google Domains上面了，三个域名一共`$36/yr`，迁移是在三月完成的，暂时由geekbone同学垫付的（加元支付的，`51 CAD`）。

|![付款截图](ns_fee_2018.jpg)|
|:--:|
|*付款截图*|

## 捐款规则

今年的域名费捐款，我们取个整，目标就暂定`0x100`元吧。至于每人捐款的数目，也取整数，就随机`2'b10`、`0b100`、`010`和`0x10`元吧。最后的捐款数量可能会超过目标，超过后看实际情况停止接受捐款，然后将筹得的所有捐款转给geekbone同学。

## 我要捐款

> 填好下面的表单后（可匿名），请点击“捐款”。随后页面会更新，表单的内容会替换为用于支付捐款的二维码（微信和支付宝各一个）和一个长度为3的字符串（捐款码）。需要注意的是，捐款的金额是随机生成的。*微信支付时，请在备注里面填写该字符串*{:style="color:red"}，否则捐款将作为匿名捐款处理。

> 支付捐款后，会有人工进行确认，并更新捐款情况。请耐心等待～

> 后台服务器代码见：[shlug-s0](https://github.com/shanghailug/shlug-s0)

> 本页面是markdown写的，具体见： [https://github.com/shanghailug/shanghailug.github.io](https://github.com/shanghailug/shanghailug.github.io/tree/master/p/s0)

<form id="donate-form">
<table>
<tr>
<td>姓名或昵称（可选）</td>
<td><input type="text" id="name" name="name" maxlength="16" /></td>
</tr>

<tr>
<td>邮箱（可选）</td>
<td><input type="text" id="email" name="email" maxlength="32" /></td>
</tr>
</table>

<p></p>
<p><input type="submit" id="submit" value="活动已结束" disabled="disabled"/></p>
</form>

## 捐款情况

### 已确认

总金额： <span id="total-number"></span>

> 由于后台程序有一段实现出现了bug，导致页面无法使用，部分同学直接转账。故出现了非2、4、8、16的捐款。

<table id="tbl-done" style="border:1px;"><tbody></tbody></table>

### 待确认

> 待确认记录会定期进行人工清理，请及时支付

<table id="tbl-todo"><tbody></tbody></table>

