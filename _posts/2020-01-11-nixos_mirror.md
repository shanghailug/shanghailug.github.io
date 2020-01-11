---
layout: post
title: 关于NixOS镜像的一些想法
date:   2020-01-11 13:40:00 +0800
categories: discuss
---

大概一年前，[NixOS更换了预编译二进制包的CDN][1]，导致国内下载Nix的预编译包非常慢（虽然以前也没快到哪里去），大多时候只有几十K。国内目前没有现成的NixOS镜像，因此想探索一套建NixOS镜像的方法。下面是这段时间我的一些想法，并做了一些实验，欢迎大家提出建议和意见（邮件列表回帖、或者微信和Telegram上讨论）。

关于如何建立NixOS镜像，网上已经有一些讨论：
- [https://nixos.org/nix-dev/2016-October/022029.html][2]
- [https://github.com/NixOS/nixpkgs/issues/32659][3]
- [https://github.com/tuna/issues/issues/323][4]
- [https://github.com/ustclug/mirrorrequest/issues/165][5]

## 需要镜像的内容

NixOS通过Nix进行包管理。一般来说，使用Nix安装软件需要下载[Nix频道][6]的相关数据和对应的预编译二进制包。其中Nix频道的数据主要包括了一组Nix表达式（一系列用Nix语言编写的文本文件），这些表达式完整的对Nix的包进行了描述。Nix表达式是通过[git][7]进行管理的，因此会持续更新。

Nix频道的数据位于[https://nixos.org/channels/][8]，里面包括多个不同的频道，对应不同的NixOS版本，以及非NixOS的Nix包的版本。目前NixOS版本的19.09，对于的频道URL是[https://nixos.org/channels/nixos-19.09][9]，该URL通过重定向，指向当前NixOS 19.09验证过的最新的一组数据。具体包括以下内容：
- nixexprs.tar.xz：打包过的Nix表达式，对所有的包进行了描述；
- binary-cache-url：当前Nix表达式包对应的预编译包的下载地址；
- git-revision：当前Nix表达式对应的git版本；
- src-url：当前Nix表达式在hydra上对应的URL；
- store-paths.xz：当前Nix表达式包含的包列表（未包含一些底层间接依赖的包）。

除了上述文件外，还有一些iso和ova文件，可用于安装NixOS。但对于日常NixOS以及Nix的使用来说，并非是必须的。

预编译包可通过Nix频道的binary-cache-url文件查询。目前来说，官方的预编译包位于[https://cache.nixos.org][10]。该URL不提供浏览器访问的界面，一般通过Nix包管理器提供的一系列命令进行访问。


## Nix频道的镜像

Nix频道的镜像比较简单，定期下载从感兴趣的频道URL下载相关文件即可。唯一需要注意的是，需要先获取重定向之后的URL，然后下载，避免下载的文件版本不一致。

## 二进制缓冲的镜像

预编译的二进制包的镜像相对比较复杂，考虑到不同版本间包存在一定重复情况，需要避免重复下载。总体来说，对于某个版本的Nix频道，可以根据`store-paths.xz`的内容，获取需要下载的包的列表，从`binary-cache-url`指定的URL，依次下载。为了 便于管理，每个版本的Nix频道可以对应一个目录用于保存预编译的包。对于Nix来说，每个这样的目录都是一个合法的[Nix存储（Nix store）][11]，可以通过一系列命令进行操作。

具体可以按照如下步骤进行操作：

1. 重复包的处理
   * 依次对store-paths.xz内的每个包，通过`nix path-info`查询该包是否已经包含在其他本地Nix存储（通过`--store`参数指定本地Nix存储的路径）中存在；
   * 若存在，则通过`nix path-info -r`获取该包以及其所有依赖对应的路径，通过`ln`命令，在目标目录（即新的Nix存储的目录），建立相关`nar`文件和`narinfo`文件的硬链接；

2. 重复的依赖包的处理
   有部分底层的依赖包，也是重复的，可能在上一步未能链接到新的Nix存储中。但从目前的情况看，这种应该情况比较少，暂时略过这步。

3. 新增包的下载
   * 通过命令`xzcat store-paths.xz | xargs nix copy --from BINARY_CACHE_URL --to file://LOCAL_STORE`进行下载；
   * 命令中的`BINARY_CACHE_URL`为文件`binary_cache_url`的内容，一般为`https://cache.nixos.org`；
   * 命令中的`LOCAL_STORE`为需要下载的新的Nix存储的路径；
   * `nix`命令会跳过本地已有的包；

## 提供服务

下载好Nix频道的文件以及对应的二进制缓冲后，可以通过HTTP服务方式，对外提供镜像。对于每个Nix频道来说，对外提供的镜像需要包括2个URL，即Nix频道的URL和二进制缓冲的URL。

* HTTP服务器仅需要提供本地文件下载服务即可；
* Nix频道镜像的URL指向最新的本地Nix频道的文件。需要注意的是，其中`binary_cache_url`文件需要修改，改为本地镜像的二进制缓冲URL；
* 二进制缓冲镜像的URL指向Nix频道对应的本地的Nix存储的路径。亦可以考虑类似`overlayfs`的方式，把所有本地的Nix存储合并起来，提供服务。

## 过期数据的清理

1. 对于Nix频道和二进制缓冲的数据，定期删除对应目录即可；
2. 对于本机的Nix存储（`/nix/store`），定期执行`nix-collect-garbage -d`即可。

## 一些实验数据

下面是这几天对`nixos-19.09`频道进行实验，统计的一些数据：

* `store-paths.xz`行数约38K；
* 对应的Nix存储（通过`nix copy`下载）：
  * 约45K个`narinfo`文件（大多数小于1K）；
  * 约45K个`nar`文件（xz压缩格式），大小不一；
    * `>10K`的约34K个；
    * `>1M`的约5K个；
    * `>10M`的约1K个；
    * `>100M`的约150个；
    * 最大的约900M；
  * 一共80G。
* 2020年1月11日的`store-paths.xz`有37969行，其中36187行和2020年1月6日的相同：
  * 约99%的包是不变的；
  * 考虑到底层依赖的包，这个比例应该更高。

## 参考

[1]: https://discourse.nixos.org/t/the-nixos-cache-is-now-hosted-by-fastly/1061
[2]: https://nixos.org/nix-dev/2016-October/022029.html
[3]: https://github.com/NixOS/nixpkgs/issues/32659
[4]: https://github.com/tuna/issues/issues/323
[5]: https://github.com/ustclug/mirrorrequest/issues/165
[6]: https://nixos.wiki/wiki/Nix_channels
[7]: https://github.com/NixOS/nixpkgs
[8]: https://nixos.org/channels/
[9]: https://nixos.org/channels/nixos-19.09
[10]: https://cache.nixos.org
[11]: https://nixos.org/nix/manual/#ch-about-nix
