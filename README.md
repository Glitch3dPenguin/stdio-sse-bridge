# MCP-SSE Bridge 🌉

A lightweight Node.js wrapper designed to convert **Stdio** (Standard Input/Output) MCP servers into **SSE** (Server-Sent Events) web services.

## Why this exists?
Most Model Context Protocol (MCP) servers are built as local processes that talk via `stdio`. However, if you want to run your MCP servers in Docker or on a remote server (like Portainer), they need to communicate over HTTP/SSE so that your AI client can reach them across the network.

This bridge acts as a translator:
`AI Client` <--> `HTTP/SSE` <--> **[ Bridge ]** <--> `Stdio` <--> `MCP Server`

## How it Works
The bridge spawns the MCP server of your choice as a child process and pipes input/output between the web request and the process.

### Environment Variables
| Variable | Default | Description |
| :--- | :--- | :--- |
| `MCP_COMMAND` | **Required** | The command to start the MCP server (e.g., `npx -y @modelcontextprotocol/server-github`) |
| `PORT` | `3001` | The port the SSE bridge will listen on. |

## Deployment (Docker Compose)
```yaml
services: null
mcp-server: null
image: 'ghcr.io/glitch3d/mcp-sse-bridge:latest'
environment:
  - PORT=3001
  - MCP_COMMAND=npx -y @modelcontextprotocol/server-github
  - GITHUB_PERSONAL_ACCESS_TOKEN=your_token_here
ports:
  - '3001:3001'
```

## Connectivity
Once running, the bridge exposes two main endpoints:
- `GET /sse`: Establish the SSE connection.
- `POST /messages`: Send messages to the MCP server.
