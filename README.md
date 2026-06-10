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
