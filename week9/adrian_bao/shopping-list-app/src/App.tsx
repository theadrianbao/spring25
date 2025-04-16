import { useState } from 'react';
import './App.css';
import ShoppingList from './ShoppingList';

export interface ShoppingItem {
  name: string;
  purchased: boolean;
  cost: number;
}

const BUDGET = 1000;

function App() {
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addItem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const formDataObj = Object.fromEntries(formData.entries());
    const calculateRemainingBudget = () => {
      return BUDGET - shoppingList.reduce((total, item) => total + item.cost, 0)
    }
    const newItem: ShoppingItem = {
      name: formDataObj.name.toString(),
      cost: parseFloat(formDataObj.cost.toString()) || 0,
      purchased: false,
    };

    const remainingBudget = calculateRemainingBudget();

    if(newItem.cost > remainingBudget) {
      setError(`Error: Item cost exceeds remaining budget`);
      return;
    }

    setShoppingList([...shoppingList, newItem]);
    setError(null);
    form.reset();
  };

  const removeItem = (event: React.MouseEvent<HTMLButtonElement>) => {
    const name = event.currentTarget.value;
    setShoppingList(shoppingList.filter((item) => item.name !== name));
  };

  return (
    <>
      <h1>Adrian's Shopping List</h1>

      <div className="card">
        <form onSubmit={addItem} className="flex-apart">
          <input type="text" name="name" placeholder="Add item to list..." required />
          <input type="number" name="cost" placeholder="Cost" step="0.01" required />
          <button className="btn purple" type="submit">Add</button>
        </form>
        {error && <p className='error'>{error}</p>}
      </div>

      <ShoppingList
        shoppingList={shoppingList}
        removeItem={removeItem}
        budget={BUDGET}
      />
    </>
  );
}

export default App;
