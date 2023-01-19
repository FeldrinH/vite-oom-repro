# Minimal reproduction of Vite `ssrLoadModule` high memory usage

Run `npm install` followed by `node --expose-gc test.js` (`--expose-gc` is required to manually trigger GC to ensure measuring heap usage is as accurate as possible)
