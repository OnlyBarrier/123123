export var globalString: string = "none";

export const setRol = (newRol: string) => {
  globalString = newRol;
};

export const getRol = ():string => {
  return globalString;
};
