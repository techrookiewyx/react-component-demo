react-component-demo
===
目前仅仅是记录个人对于组件封装以及npm发布流程的笔记

# 账号注册

如果你想要将自己封装的组件发布到npm上，首先我们要去npm的官网注册一个账号。这里没有什么过多的介绍，注意一点就是在注册我们的Username要尽量简洁，这样不仅方便自己记忆、也方便别人的搜索。

# 新建GitHub仓库

首先确保你已经安装了Node.js和Git，在你的命令窗口输入如下命令，并查看结果若以v `xx.xx.x`表示你以安装了node，对于git若结果显示 `git version x.xx.x`表示安装了git。
```bash
node -v  #查看你的node版本

git -v #查看你的git版本
```
建立仓库的目的是为了在我们发布的npm中说明我们包的来源，为使用我们组件包的人提供更细致的说明（这里要配合项目的package.json来进行配置，后续会详细说明），同时有利于我们代码进行管理和维护。

- 注意一点如果我们的仓库是开源，通常在创建时选择`license`（许可证）为MIT，这表示你的仓库仅仅保留版权。

# 创建目录，搭建框架

你可以参照如下指令，在本地创建项目目录，将刚刚我们在GitHub上创建仓库克隆到新建目录中主要是为了与远程仓库产生关联，然后初始化项目包。

```bash
mkdir react-component-demo  #创建项目目录
cd react-component-demp  #进入目录
git clone xxxx.xxxxx.com  #克隆github远程仓库内容
npm init  #初始化仓库，创建package.json文件，你也可以手动创建
```

## 创建主工程

在主工程中我们需要添加一些其他文件来配置工程如`.gitignore`、`tsconfig.json`等。



配置package.json文件中一些配置项

### private

通常在一个项目中分为好多个工程，而每个工程都有各自的package.json，针对该项目来说我们只发布某一个工程中封装的组件，所以对于主工程不需要不发布，而private字段可以防止我们意外地将私有库发布到npm服务器，你可以进行如下配置

```json
{
 "private": true
}
```

### devDependencies

该字段表示我们开发阶段所使用的一些依赖包，这些依赖用于辅助我们开发。当打包上线时并不需要的包，不会被安装到生产环境中。

```json
{
  "devDependencies": {
    "compile-less-cli": "^1.8.14",
    "husky": "^8.0.3",
    "lerna": "^7.0.1",
    "lint-staged": "^13.2.0",
    "prettier": "^3.0.0",
    "tsbb": "^4.1.0"
  }
}
```

这里说明以下关于依赖版本的问题，通常包版本规则为`[major,minor,patfch]` 分别表示大版本、小版本、补丁版本。而`^` 表示我们安装时大版本不变安装最新的小版本和补丁版本，`~`表示安装时大版本和小版本不变安装最新的补丁版本，若两个符号都没有则表示安装指定版本。

### scripts

该字段用于配置一些package.json中内置的脚本入口，是key-value键值对配置，类似于快捷指令key是我们指定的一个名字，而value是实际执行的指令，看部分配置实例。

```json
{
  "scripts": {
    "watch": "lerna exec --scope @wyxin/react-component-demo -- tsbb watch \"src/*.{ts,tsx}\" --use-babel --cjs cjs & npm run css:watch",
    "build": "lerna exec --scope @wyxin/react-component-demo -- tsbb build \"src/*.{ts,tsx}\" --use-babel --cjs cjs && npm run css:build",
    "start": "lerna exec --scope website -- npm run start",
    "doc": "lerna exec --scope website -- npm run build",
    "css:build": "lerna exec --scope @wyxin/react-component-demo -- compile-less -d src -o esm",
    "css:watch": "lerna exec --scope @wyxin/react-component-demo -- compile-less -d src -o esm --watch"
  }
}
```

例如`watch`是我们自己定义的，当我们运行`npm run watch `时实际运行的是冒号后边的指令。而其中`lerna` 是一个构建系统工具，用于管理同一个工程中存储的其他工程的执行。`exec` 表示执行、`--scope`表示执行范围、`&`表示同时运行两个命令，所以该指令的大致意思是在`@wyxin/react-component-demo`包下同时执行两个命令。

### workspaces

该字段用于在主工程中管理多个子工程的包，通过声明`workspaces`该字段下的目录的子包依赖提升到主工程安装、并且会与子包的依赖进行关联

```json
{
 "workspaces": [
    "core",
    "www"
 ],
}
```

`workspaces` 字段接收一个数组，数组里面可以填写相对根目录的文件夹名称或者是通配符。上述表示主工程会管理`core`和`www`文件夹下的子工程（这两个工程会在后边介绍）。

### engines

指定使用你的包时必须安装的版本

## 组件子工程

该工程位于主工程的core目录下，也是我们发布到npm的子工程，在该目录下有src目录是我们封装组件的源码。

### Example

```tsx mdx:preview
import React, { useState } from 'react';
import Example from '@wyxin/react-component-demo';

export default function Demo() {
  const [value, setValue] = useState([]);
  return (
    <React.Fragment>
      <Example title="tom" />
    </React.Fragment>
  );
}
```



由于要发布到npm所以在package.json中添加一些关于发布的配置项，同时需要删除`private` 字段

### name&version

name字段用于定义组件包发布的包名，version指定发布包的版本号，这两个字段共同为我们的包创建了唯一ID。

```json
{
  "name": "@wyxin/react-component-demo",
  "version": "1.1.0"
}
```

### main&module

这两个字段都用于指定工程的入口文件，区别是main指定的是当我们使用require（CommonJS语法）加载模块时使用时的入口文件，而module指定的是我们使用import（ESM语法）加载模块时的入口文件

```json
{
  "main": "cjs/index.js",
  "module": "esm/index.js"
}
```

这里提供两种方法，可以让使用包的用户灵活选择

### files

该字段接收一个数组，用于说明我们把包发布到npm时哪些文件或文件夹会被推送到npm。也可以用来描述当把包当做依赖包安装时需要说明的文件列表

```json
{
  "files": [
    "cjs",
    "esm"
  ]
}
```

上述配置表示指定cjs和esm目录npm发布时的文件目录

### 一些描述类字段

完善`description`、homepage、repository、keywords等一些用于描述包的信息，这些信息也用于查找时的关键字。



最后为你的子项目添加READ.me来告诉用户如何使用你的包，以及你的包的介绍

## 测试子工程

该工程位于主工程的www目录下，用于在发布前的进行本地测试。

在构建测试子工程之前我们可以先在主工程中运行`npm run watch`来将组件子工程中一些文件编译为可供我们测试的js和css文件。

### 构建测试项目

可以使用`create react app `来作为测试子项目的构建工具，项目构建完毕就可以将我们封装的组件对应的包引入到测试子工程的`package.json`的依赖中，并在测试项目入口文件`index.js`中引入对应组件进行测试。

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import ComponentDemo from '@wyxin/react-component-demo';
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <div>
  	<ComponentDemo/>
  </div>
)
```

最后在主工程目录下使用`npm i`  安装所有项目依赖，然后`npm run start`运行测试项目查看测试结果即可。

# 发布&提交

测试结果没问题，就可以发布到npm了。终端或命令窗口进入core目录下并运行如下指令

```bash
npm login #登录到npm,需要输入你注册时的用户名、密码以及邮箱验证

npm publish #发布
```

在主工程目录下提交到git仓库

```bash
git add .  
git commit -m 'init project'
git push 
```

