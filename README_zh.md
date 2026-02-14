# GitHub Rate Limit 仪表盘

一个现代化的可视化仪表盘，用于监控您的 GitHub API 速率限制，带有交互式工具提示和直接文档链接。

![仪表盘截图](./screenshots/dashboard.png)

## 功能特性

- **可视化仪表盘：** 以卡片形式查看 Core、Search、GraphQL 等 API 限制。
- **进度跟踪：** 颜色编码的进度条显示您的使用状态（绿色/黄色/红色）。
- **时间转换：** 自动将 Unix 时间戳转换为本地可读时间。
- **安全存储：** 您的 GitHub Personal Access Token (PAT) 仅存储在浏览器本地存储中。
- **交互式工具提示：** 将鼠标悬浮在资源名称上查看详细描述。
- **文档链接：** 点击资源旁边的文档图标 (📄) 查看 GitHub 官方文档。


## 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS

## 快速开始

1. **克隆仓库：**
   ```bash
   git clone <repository-url>
   cd github-rate-dashboard
   ```

2. **安装依赖：**
   ```bash
   npm install
   ```

3. **启动开发服务器：**
   ```bash
   npm run dev
   ```

4. **在浏览器中打开：**
   打开终端显示的 URL（通常为 `http://localhost:5173`）。

5. **输入您的 Token：**
   粘贴您的 GitHub Personal Access Token 查看限制。(拿token `https://github.com/settings/tokens`)
   核心指令: ` curl -i -H "Authorization: token your_token_here" https://api.github.com/rate_limit`

## 生产构建

```bash
npm run build
```

输出将在 `dist` 目录中。

## 使用方法

- **Token 输入：** 安全输入您的 GitHub PAT。它存储在浏览器本地。
- **刷新数据：** 点击刷新按钮更新速率限制。
- **查看详情：** 将鼠标悬浮在资源名称上查看工具提示，或点击文档链接获取更多信息。
- **登出：** 清除您的 Token 和数据。

## 安全说明

您的 GitHub Token 不会发送到任何外部服务器。所有处理都在您的浏览器客户端进行。

## 贡献

欢迎提出问题或提交拉取请求以改进项目。

## 添加截图

要为文档添加截图：

1. 截取仪表盘界面的屏幕截图
2. 将它们保存到 `screenshots/` 目录中，命名为 `dashboard.png` 和 `tooltip.png`
3. 图片将自动在 README 文件中显示

示例：打开应用，截取主仪表盘视图，并将鼠标悬浮在资源上截取工具提示。