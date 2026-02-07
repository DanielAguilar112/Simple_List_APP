import React, { useState, useEffect } from 'react'; // 1. Added useEffect here
import './App.css'; 

export default function SimpleListApp() {
  // 2. Modified state to check LocalStorage first
  const [lists, setLists] = useState(() => {
    const savedData = localStorage.getItem('taskmaster_data');
    return savedData ? JSON.parse(savedData) : {
      Personal: [{ id: 1, text: 'Go to the gym', selected: false }],
      Work: [{ id: 1, text: 'Create new api', selected: false }], 
      Groceries: [{ id: 1, text: 'Milk', selected: false }]
    };
  });

  const [activeTab, setActiveTab] = useState('Personal');
  const [inputValue, setInputValue] = useState('');

  // 3. Added the "Watcher" to save every time lists changes
  useEffect(() => {
    localStorage.setItem('taskmaster_data', JSON.stringify(lists));
  }, [lists]);

  const updateList = (newList) => setLists({ ...lists, [activeTab]: newList });

  const addItem = () => {
    if (!inputValue.trim()) return;
    updateList([...lists[activeTab], { id: Date.now(), text: inputValue, selected: false }]);
    setInputValue('');
  };

  const removeItem = (id) => updateList(lists[activeTab].filter(i => i.id !== id));

  const toggleSelect = (id) => updateList(lists[activeTab].map(item => 
    item.id === id ? { ...item, selected: !item.selected } : item
  ));

  const joinItems = () => {
    const selected = lists[activeTab].filter(i => i.selected);
    if (selected.length < 2) return alert("Select at least 2 items to join");
    const joinedText = selected.map(i => i.text).join(" & ");
    const remaining = lists[activeTab].filter(i => !i.selected);
    updateList([...remaining, { id: Date.now(), text: joinedText, selected: false }]);
  };

  const splitItems = () => {
    let newItems = [...lists[activeTab].filter(i => !i.selected)];
    lists[activeTab].filter(i => i.selected).forEach(item => {
      if (item.text.includes(" & ")) {
        item.text.split(" & ").forEach((t, i) => newItems.push({ id: Date.now() + i, text: t, selected: false }));
      } else {
        newItems.push({ ...item, selected: false });
      }
    });
    updateList(newItems);
  };

  return (
    <div className="screen-wrapper">
      <div className="app-card">
        <h2>📝 TaskMaster</h2>

        <div className="tab-bar">
          {Object.keys(lists).map(tab => (
            <button 
              key={tab} 
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="input-group">
          <input 
            type="text"
            value={inputValue} 
            onChange={e => setInputValue(e.target.value)} 
            onKeyPress={e => e.key === 'Enter' && addItem()}
            placeholder="Add a new task..." 
          />
          <button className="add-btn" onClick={addItem}>Add</button>
        </div>

        <div className="action-group">
          <button className="action-btn" onClick={joinItems}>🔗 Join</button>
          <button className="action-btn" onClick={splitItems}>✂️ Split</button>
        </div>

        <div className="list-container">
          {lists[activeTab].map(item => (
            <div key={item.id} className="list-item">
              <label className="item-content">
                <input type="checkbox" checked={item.selected} onChange={() => toggleSelect(item.id)} />
                <span style={{ textDecoration: item.selected ? 'line-through' : 'none', color: item.selected ? '#a69898' : '#e2dada' }}>
                  {item.text}
                </span>
              </label>
              <button className="delete-btn" onClick={() => removeItem(item.id)}>🗑️</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}