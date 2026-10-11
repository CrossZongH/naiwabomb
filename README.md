# 奶蛙扫雷

一个面向手机浏览器的奶蛙主题无尽扫雷小游戏。项目使用原生 HTML、CSS 和 JavaScript 编写，无需前端框架或构建工具，推送到 GitHub Pages 后即可在线游玩。

## 在线游玩

如果仓库已启用 GitHub Pages，可访问：

```text
https://你的用户名.github.io/naiwabomb/
```

## 功能

- 适配手机屏幕的响应式界面
- 固定 8 × 10 棋盘和 12 颗雷
- 短按翻开格子，长按插旗或取消插旗
- 首次点击自动避开地雷
- 清除所有安全格后进入下一关
- 失败时先显示全部奶蛋雷，4 秒后显示失败结算
- 胜利和失败结算使用自定义图片与音频
- 支持连续通关统计和重新开始

## 本地运行

项目是静态网页，可以使用任意静态文件服务器运行。

使用 Node.js：

```bash
npx serve -l 5173
```

然后在浏览器打开 `http://localhost:5173`。

也可以使用 VS Code 的 Live Server 扩展打开 `index.html`。

### 手机调试

让电脑和手机连接同一个 Wi-Fi，在项目目录启动服务。查看电脑局域网 IP：

```bash
ipconfig
```

在手机浏览器访问：

```text
http://电脑局域网IP:5173
```

如果 Windows 防火墙询问权限，请允许 Node.js 访问专用网络。

## GitHub Pages 部署

1. 在 GitHub 创建一个名为 `naiwabomb` 的公开仓库。
2. 将本项目推送到 `main` 分支：

   ```bash
   git add .
   git commit -m "更新奶蛙扫雷"
   git push -u origin main
   ```

3. 打开仓库的 **Settings → Pages**。
4. 在 **Build and deployment** 中选择 **Deploy from a branch**。
5. 分支选择 `main`，目录选择 `/ (root)`，点击 **Save**。

几分钟后即可通过 GitHub Pages 地址访问。之后每次推送到 `main`，页面会自动更新。

## 项目结构

```text
.
├── index.html       # 页面结构
├── styles.css       # 响应式样式
├── app.js           # 扫雷逻辑与触摸交互
├── assets/          # 图片和音频素材
└── README.md
```

## 玩法

- **短按**：翻开格子。
- **长按约半秒**：插旗或取消插旗。
- 翻开所有非雷格子即可挑战胜利。
- 踩到雷后会显示全部地雷，等待 4 秒进入失败结算。
- 结算界面需要点击按钮后才会开始下一关或重新挑战。

## 素材说明

游戏素材来自本项目素材目录，文件用途如下：

| 文件 | 用途 |
| --- | --- |
| `assets/hero.jpg` | 主页面奶蛙图片 |
| `assets/flag.jpg` | 插旗图标 |
| `assets/mine.jpg` | 地雷图标 |
| `assets/result.jpg` | 结算图片 |
| `assets/laugh.mp3` | 结算音频 |

## 作者与致谢

- 作者：纵横
- 特别鸣谢：苑苑

## 许可证

本项目代码采用 [MIT License](LICENSE) 发布。项目中图片和音频素材的使用范围请以素材原作者的授权为准。
