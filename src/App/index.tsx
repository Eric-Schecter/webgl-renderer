import React, { useRef, useEffect } from 'react';
import { Application } from './gl';
import styles from './index.module.scss';
import { Options } from './components';

type Props = {
  GL_App: new (container: HTMLDivElement) => Application
}

export const App = ({ GL_App }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) { return }
    const container = ref.current;
    const app = new GL_App(container);
    const start = async () => {
      await app.setup();
      try {
        app.run();
      } catch (error) {
        console.log(error);
      }
    }
    start();
    return app.dispose;
  }, [ref, GL_App])

  return <div>
    <div
      ref={ref}
      className={styles.main}
    />
    <Options containerRef={ref} />
  </div>
}