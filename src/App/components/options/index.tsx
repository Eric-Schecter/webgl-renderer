import { RefObject, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { GUIHandler } from "../../gui";
import { routes } from "../../routes";

type Props = {
  containerRef: RefObject<HTMLDivElement>;
}

export const Options = ({ containerRef }: Props) => {
  const navigate = useHistory();
  const { pathname } = useLocation();
  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const gui = GUIHandler.getInstance();
    gui.append(containerRef.current);
    const folder = GUIHandler.getInstance().createRadioFolder('pages');
    routes.forEach(({ path, name }) => {
      folder.addItem(name, () => navigate.push(path), path === pathname);
    })
    return gui.dispose;
  }, [containerRef, navigate, pathname])

  return null;
}