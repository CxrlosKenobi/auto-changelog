const world = 'world';

export function hello(who: string = world): null {
  console.log(`Hello ${who}!`);
  return null;
}

hello(); // Hello world!
