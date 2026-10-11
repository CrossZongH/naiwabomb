# 奶蛙扫雷

一个适合手机浏览器的奶蛙主题无尽扫雷小游戏，纯 HTML / CSS / JavaScript，无需安装依赖。

## 在 GitHub 建仓库并发布

1. 登录 GitHub，点击右上角 **+ → New repository**。
2. 仓库名填 `naiwabomb`，选择 **Public**，点击 **Create repository**。
3. 在本地项目目录执行：

   ```bash
   git init
   git add .
   git commit -m "初版奶蛙扫雷"
   git branch -M main
   git remote add origin https://github.com/你的用户名/naiwabomb.git
   git push -u origin main
   ```

4. 打开仓库的 **Settings → Pages**，在 **Build and deployment** 里选 **Deploy from a branch**，分支选 `main`、目录选 `/ (root)`，点 **Save**。
5. 等待一两分钟，用手机访问 `https://你的用户名.github.io/naiwabomb/`。

以后修改后执行 `git add . && git commit -m "更新游戏" && git push`，网页会自动更新。

## 手机端调试

电脑和手机连接同一个 Wi-Fi，在项目目录运行：

```bash
npx serve -l 5173
```

查看电脑局域网 IP（Windows 可运行 `ipconfig`），然后在手机浏览器打开 `http://电脑IP:5173`。如果电脑防火墙弹窗，允许 Node.js 访问专用网络。

也可以直接用 VS Code 的 Live Server 扩展，在手机打开它显示的局域网地址。

## 玩法

- 固定 8 × 10 棋盘、12 颗雷，首次生成后即开始。
- 短按揭开格子，长按约半秒插旗或取消插旗。
- 清除全部安全格即挑战胜利，踩雷则挑战失败；结算时会播放奶蛙音频。
- 胜利后自动进入下一关，保持连续通关数。
