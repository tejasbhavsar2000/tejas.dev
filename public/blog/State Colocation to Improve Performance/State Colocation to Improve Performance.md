# State Colocation to Improve Performance

Created: July 10, 2021 11:58 AM


Hello Everyone,

In this blog, We'll talk about State Colocation and How it helps to improve performance of our React Web Application. Let's dive in then!.

So, First question of all **What is State Colocation?**

Simply putting, State Colocation is nothing but a Practice of Declaring a State as closely as possible to Component where that State is used.

## When State is defined far from where it is used.

```jsx
function PokemonName({ pokemon, onChange }) {
  return (
    <div>
      <label htmlFor="pokemon">Pokemon Name</label>
      <br />
      <input
        id="pokemon"
        value={pokemon}
        onChange={(e) => onChange(e.target.value)}
      />
      <p>
        {pokemon ? `${pokemon} is my favourite pokemon` : "enter a pokemon"}
      </p>
    </div>
  );
}

function App() {
  const [pokemon, setPokemon] = useState("");
  return (
    <div>
      <PokemonName pokemon={pokemon} onChange={setPokemon} />
    </div>
  );
}
```

In above snippet a component PokemonName which take two props as pokemon and a function PokemonName, and the variable pokemon is state defined in **App** Component which is passed as props to PokemonName Component.

This type of Code can lead to performance related issue like, whenever the pokemon state is changed it will re-render PokemonName Component as well as **App** Component.

### App Component re-renders when pokemon state is changed:

![Untitled](State%20Colocation%20to%20Improve%20Performance/Untitled.png)

### PokemonName Component re-renders when pokemon state is changed:

![Untitled](State%20Colocation%20to%20Improve%20Performance/Untitled%201.png)

As we can see here, re-render App and PokemonName components every time the state is changed. This is not good for large scale web app.

So, what can we do solve this, check below snippet:

## When State Collocated near to where it is used.

```jsx
function PokemonName() {
  const [pokemon, setPokemon] = useState("");
  return (
    <div>
      <label htmlFor="pokemon">Pokemon Name</label>
      <br />
      <input
        id="pokemon"
        value={pokemon}
        onChange={(e) => setPokemon(e.target.value)}
      />
      <p>{`${pokemon} is my favourite pokemon`}</p>
    </div>
  );
}

function App() {
  return (
    <div>
      <PokemonName />
    </div>
  );
}
```

### App Component re-renders when pokemon state is changed:

![Untitled](State%20Colocation%20to%20Improve%20Performance/Untitled%202.png)

### PokemonName Component re-renders when pokemon state is changed:

![Untitled](State%20Colocation%20to%20Improve%20Performance/Untitled%203.png)

Here, as the App component do not have pokemon state, it doesn't re-render whenever the state is changed and the render time for each re-render is much better than before. 

## Wrapping Up

As we seen above, State Collocation can be good practice while working on large scale projects. That's it, Hope you enjoyed!

Have a Good Day! 👋