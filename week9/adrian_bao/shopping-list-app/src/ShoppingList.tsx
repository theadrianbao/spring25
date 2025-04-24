import React from 'react';
import { ShoppingItem } from './App';

interface ShoppingListProps {
  shoppingList: ShoppingItem[];
  removeItem: (event: React.MouseEvent<HTMLButtonElement>) => void;
  budget: number;
}

function ShoppingList({ shoppingList, removeItem, budget }: ShoppingListProps) {
  const totalSpent = shoppingList.reduce((acc, item) => acc + item.cost, 0);
  const remainingBudget = budget - totalSpent;

  return (
    <>
      <b><p>Remaining Budget: ${remainingBudget.toFixed(2)}</p></b>

      {shoppingList.map((val: ShoppingItem, index: number) => (
        <div
          className={val.purchased ? 'card flex-apart green' : 'card flex-apart'}
          key={index}
        >
          <span>{val.name} - ${val.cost.toFixed(2)}</span>
          <span>{val.category}</span>
          <span>{val.dueDate ? `Due: ${val.dueDate}` : ''}</span>
          <span>
            <button className="btn" onClick={removeItem} value={val.name}>
              Remove
            </button>
          </span>
        </div>
      ))}
    </>
  );
}

export default ShoppingList;
