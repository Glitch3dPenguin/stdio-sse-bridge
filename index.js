const express = require('express');
const { SSEServerTransport } = require('@modelcontextprotocol/sdk/server/sse.js');
const { spawn } = require('child_process');

const app = express();
const port = process.env.PORT || 3001;

// The command to run the actual MCP server (e.g., "npx -y @modelcontextprotocol/server-github")
const mcpCommand = process.env.MCP_COMMAND;
const mcpArgs = mcpCommand ? mcpCommand.split(' ').slice(1) : [];
const mcpExe = mcpCommand ? mcpCommand.split(' ')[0] : 'npx';

if (!mcpCommand) {
  console.error("ERROR: MCP_COMMAND environment variable is required.");
  process.exit(1);
}

let transport;
const child = spawn(mcpExe, mcpArgs, {
  env: { ...process.env },
  stdio: ['pipe', 'pipe', 'inherit']
});

// Handle output from the MCP server
child.stdout.on('data', (data) => {
  if (transport) {
    transport.send(data.toString());
  } else {
    console.log(`[MCP Server]: ${data}`);
  }
});

app.get('/sse', async (req, res) => {
  console.log("New SSE connection established");
  transport = new SSEServerTransport('/messages', res);
  await transport.start();
});

app.post('/messages', async (req, res) => {
  if (!transport) {
    res.status(503).send('SSE transport not initialized');
    return;
  }
  // Send the client request directly to the MCP server's stdin
  child.stdin.write(req.body);
  res.sendStatus(202);
});

app.listen(port, () => {
  console.log(`MCP-SSE Bridge running on port ${port}`);
  console.log(`Wrapping command: ${mcpCommand}`);
});
