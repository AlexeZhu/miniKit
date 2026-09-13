# miniKit · 微集

Gather mini App / ideas / requirements into a platform.

收录微信小程序、收集灵感点子、发布带预算与工期的开发需求。

## 运行

```bash
npm install
npm run dev
```

浏览器打开终端提示的本地地址（默认 `http://localhost:5173`）。

数据保存在当前浏览器的 localStorage，右上角可切换演示账号。

## 让其他人访问

这是静态网站。`npm run dev` 只在你这台电脑上有效；要给外网用户一个链接，需要托管构建产物。

**注意：** 目前数据存在每位访客自己的浏览器里，别人打开你的网站时看到的是各自的一份数据，不会自动共用。要做成真正的公共平台，还需要后端和数据库。

### 方式一：Vercel（推荐，免费 HTTPS）

1. 注册 [Vercel](https://vercel.com)（可用 GitHub 登录）。
2. 在项目目录执行：

```bash
npx vercel
```

按提示登录后选择默认即可。完成后会给出类似 `https://xxx.vercel.app` 的地址，把这个链接发给别人就能打开。

正式环境再执行一次：

```bash
npx vercel --prod
```

也可把代码推到 GitHub，在 Vercel 控制台 Import 该仓库，之后每次推送会自动发布。

### 方式二：Netlify Drop（不写命令）

1. 本地执行 `npm run build`，得到 `dist` 文件夹。
2. 打开 [https://app.netlify.com/drop](https://app.netlify.com/drop)，把整个 `dist` 文件夹拖进去。
3. 得到一个 `https://随机名.netlify.app` 链接。

### 方式三：同一 Wi‑Fi 临时体验

```bash
npm run dev
```

把终端里的 Network 地址（例如 `http://192.168.x.x:5173`）发给同一局域网的人。电脑睡眠、关终端或换网络后就失效，也不适合发给外网朋友。
