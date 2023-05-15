import { TriangleDemo, ModelDemo, ClipPlaneDemo } from './examples';

export const routes = [
  { path: '/', name: 'triangle', app: TriangleDemo },
  { path: '/model', name: 'model', app: ModelDemo },
  { path: '/clip-plane', name: 'clip-plane', app: ClipPlaneDemo },
]