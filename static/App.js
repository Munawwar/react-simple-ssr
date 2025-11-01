import { useState } from 'react';
import { html } from 'htm/react';

/**
 * @param {import('react').PropsWithChildren<{initialCount: number}>} props 
 * @returns {JSX.Element}
 */
export function App({ initialCount }) {
  const [count, setCount] = useState(initialCount);

  return html`
    <div className="container">
      <h1>Counter</h1>
      <div className="count">${count}</div>
      <div className="buttons">
        <button onClick=${() => setCount(count + 1)}>+</button>
        <button onClick=${() => setCount(count - 1)}>-</button>
      </div>
    </div>
  `;
}

