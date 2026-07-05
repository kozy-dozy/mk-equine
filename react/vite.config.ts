import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dynamicImport from 'vite-plugin-dynamic-import'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    babel: {
      plugins: [
        'babel-plugin-styled-components'
      ]
    }
  }),
  dynamicImport()],
  assetsInclude: ['**/*.md'],
  resolve: {
    // @kozydozy/* are aliased directly to the shared package SOURCE (not
    // installed to node_modules) so they compile with mk-equine's single copy
    // of react/styled-components. Subpath regexes must precede the bare aliases.
    alias: [
      { find: /^@kozydozy\/ui\/(.*)$/, replacement: path.resolve(__dirname, '../../packages/ui/src') + '/$1' },
      { find: /^@kozydozy\/ui$/, replacement: path.resolve(__dirname, '../../packages/ui/src/index.ts') },
      { find: /^@kozydozy\/forms\/(.*)$/, replacement: path.resolve(__dirname, '../../packages/forms/src') + '/$1' },
      { find: /^@kozydozy\/forms$/, replacement: path.resolve(__dirname, '../../packages/forms/src/index.ts') },
      { find: /^@kozydozy\/shared\/(.*)$/, replacement: path.resolve(__dirname, '../../packages/shared/src') + '/$1' },
      { find: /^@kozydozy\/shared$/, replacement: path.resolve(__dirname, '../../packages/shared/src/index.ts') },
      { find: /^@kozydozy\/foundation\/(.*)$/, replacement: path.resolve(__dirname, '../../packages/foundation/src') + '/$1' },
      { find: /^@kozydozy\/foundation$/, replacement: path.resolve(__dirname, '../../packages/foundation/src/index.ts') },
      { find: /^@kozydozy\/routing\/(.*)$/, replacement: path.resolve(__dirname, '../../packages/routing/src') + '/$1' },
      { find: /^@kozydozy\/routing$/, replacement: path.resolve(__dirname, '../../packages/routing/src/index.ts') },
      { find: /^@kozydozy\/layout\/(.*)$/, replacement: path.resolve(__dirname, '../../packages/layout/src') + '/$1' },
      { find: /^@kozydozy\/layout$/, replacement: path.resolve(__dirname, '../../packages/layout/src/index.ts') },
      { find: /^@kozydozy\/theme$/, replacement: path.resolve(__dirname, '../../packages/theme/src/index.ts') },
      { find: /^@kozydozy\/tokens$/, replacement: path.resolve(__dirname, '../../packages/tokens/src/index.ts') },
      { find: '@', replacement: path.join(__dirname, 'src') },
    ],
    // The aliased @kozydozy/* source lives outside this app; force a single
    // copy of these so hooks/context/theme work across the boundary.
    dedupe: [
      'react',
      'react-dom',
      'styled-components',
      'react-redux',
      '@reduxjs/toolkit',
      'redux',
    ],
  },
  server: {
    // allow Vite dev server to read the sibling packages/ source
    fs: { allow: [path.resolve(__dirname, '..', '..')] },
  },
  build: {
    outDir: 'build'
  }
});
