import { useState } from 'react';
import './App.css';
import ShoppingList from './ShoppingList';

export interface ShoppingItem {
  name: string;
  purchased: boolean;
  cost: number;
  category: string;
  dueDate: string | null;
}

const BUDGET = 1000;

function App() {
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const addItem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const formDataObj = Object.fromEntries(formData.entries());

    const newItem: ShoppingItem = {
      name: formDataObj.name.toString(),
      cost: parseFloat(formDataObj.cost.toString()) || 0,
      purchased: false,
      category: formDataObj.category.toString() || 'General',
      dueDate: formDataObj.dueDate ? formDataObj.dueDate.toString() : null,
    };

    const remainingBudget = BUDGET - shoppingList.reduce((total, item) => total + item.cost, 0);

    if (newItem.cost > remainingBudget) {
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

  const filterByCategory = (item: ShoppingItem) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  };

  return (
    <>
      <h1>Adrian's Shopping List</h1>

      <div className="card">
        <form onSubmit={addItem} className="flex-apart">
          <input type="text" name="name" placeholder="Add item to list..." required />
          <input type="number" name="cost" placeholder="Cost" step="0.01" required />
          <select name="category" required>
            <option value="Grocery">Grocery</option>
            <option value="School">School</option>
            <option value="Life">Life</option>
          </select>
          <input type="date" name="dueDate" />
          <button className="btn purple" type="submit">Add</button>
        </form>
        {error && <p className='error'>{error}</p>}
      </div>

      <div>
        <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
          <option value="All">All</option>
          <option value="Grocery">Grocery</option>
          <option value="School">School</option>
          <option value="Life">Life</option>
        </select>
      </div>

      <ShoppingList
        shoppingList={shoppingList.filter(filterByCategory)}
        removeItem={removeItem}
        budget={BUDGET}
      />
    </>
  );
}

export default App;
