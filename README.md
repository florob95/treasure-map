# Node.js TypeScript Treasure Map

Treasure map test tech, this program take a file as input (resource/input/input.txt). The result is display in the console and write in the file (resource/output/output.txt).

## Prerequisites

- **Node.js v18 minimum**: Make sure you are using Node.js version 18 or higher. You can check the installed version with:
  ```bash
  node -v
  ```

## Installation

To install the project dependencies, run:

```bash
npm install
```

## Available Scripts

Here are the various commands available in the project:

- `npm run start`: Run Node.js program. Use this command to run the application.
- `npm run start:docker`: Run the program in docker (need to can build source)
- `npm run start:watch`: Starts the server in watch mode. Automatically restarts the server on file changes.
- `npm run start:dev`: Starts the server in watch mode with continuous TypeScript transpilation. Uses the concurrently package to run both the server and transpilation in parallel.
- `npm run build`: Transpiles the TypeScript code to JavaScript using esbuild. The generated files are placed in the build folder.
- `npm run watch`: Performs the same task as build, but in watch mode. Automatically recompiles the files on changes.
- `npm run lint`: Run eslint and prettier.
- `npm run lint:fix`: Run eslint and prettier with fix.
- `npm run format`: Run prettier.
- `npm run format:fix`: Run prettier with fix.
- `npm run test`: Run unit test
