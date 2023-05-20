import { TriangleDemo, ClipPlaneDemo, DisplayModeDemo, TextureDemo } from './examples';

export const routes = [
  { path: '/', name: 'triangle', app: TriangleDemo },
  // { path: '/model', name: 'model', app: ModelDemo },
  { path: '/clip-plane', name: 'clip-plane', app: ClipPlaneDemo },
  { path: '/display-mode', name: 'display-mode', app: DisplayModeDemo },
  { path: '/texture', name: 'texture', app: TextureDemo },
]