# State Colocation to Improve Performance

Created: **July 10, 2021 11:58 AM**



### Hello Everyone,

In this blog, We'll talk about State Colocation and How it helps to improve performance of our React Web Application. Let's dive in then!.

So, First question of all **What is State Colocation?**

Simply putting, State Colocation is nothing but a Practice of Declaring a State as closely as possible to Component in which that State is used.

## When State is defined far from where it is used.

```jsx
function DogName({ dog, onChange }) {
  return (
    <div>
      <label htmlFor="dog">Dog Name</label>
      <br />
      <input id="dog" value={dog} onChange={(e) => onChange(e.target.value)} />
      <p>{dog ? `${dog}'s favorite number is` : "enter a dog name"}</p>
    </div>
  );
}

function App() {
  const [dog, setDog] = useState("");
  return (
    <div>
      <DogName dog={dog} onChange={setDog} />
    </div>
  );
}
```

In above snippet a component **DogName** which take two props as **dog** and a function **onChange**, and the variable **dog** is state defined in **App** Component which is passed as props to **DogName** Component.

This type of Code can lead to performance related issue like, whenever the dog state is changed it will re-render **DogName** Component as well as **App** Component.

### App Component re-renders when dog state is changed:

![State%20Colocation%20to%20Improve%20Performance/Untitled.png](State%20Colocation%20to%20Improve%20Performance/Untitled.png)

### DogName Component re-renders when dog state is changed:

![State%20Colocation%20to%20Improve%20Performance/Untitled%201.png](State%20Colocation%20to%20Improve%20Performance/Untitled%201.png)

As we can see here, re-render App and DogName components every time the state is changed and the render time for each re-render is >1ms. This is not good for large scale web app.

So, what can we do solve this, check below snippet:

## When State Collocated near to where it is used.

```jsx
function DogName() {
  const [dog, setDog] = useState("");
  return (
    <div>
      <label htmlFor="dog">Dog Name</label>
      <br />
      <input id="dog" value={dog} onChange={(e) => setDog(e.target.value)} />
      <p>{dog ? `${dog}'s favorite number is` : "enter a dog name"}</p>
    </div>
  );
}

function App() {
  return (
    <div>
      <DogName />
    </div>
  );
}
```

### App Component re-renders when dog state is changed:

![State%20Colocation%20to%20Improve%20Performance/Untitled%202.png](State%20Colocation%20to%20Improve%20Performance/Untitled%202.png)

### DogName Component re-renders when dog state is changed:

![State%20Colocation%20to%20Improve%20Performance/Untitled%203.png](State%20Colocation%20to%20Improve%20Performance/Untitled%203.png)

Here, as the App component do not have dog state, it doesn't re-render whenever the state is changed and the render time for each re-render is much better than before. 

## Wrapping Up

As we seen above, State Collocation can be good practice while working on large scale projects. That's it, Hope you enjoyed!

Have a Good Day! 👋