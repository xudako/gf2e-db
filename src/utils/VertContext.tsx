import { createContext, useContext, ReactNode } from 'react';

type VertContextType = {
  vertebrae: number;
};

const VertContext = createContext<VertContextType>({
  vertebrae: 0,
});

export const VertProvider = ({
  children,
  vertebrae,
}: {
  children: ReactNode;
  vertebrae: number;
}) => {
  return <VertContext.Provider value={{ vertebrae }}>{children}</VertContext.Provider>;
};

export const useVertebrae = () => useContext(VertContext);
