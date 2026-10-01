export function getRequiredElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Required element #${id} is missing`);
  }

  return element as T;
}

export function getElement<T extends HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}
