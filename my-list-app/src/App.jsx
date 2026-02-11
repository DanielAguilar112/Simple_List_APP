import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// CHANGE THIS TO YOUR ACTUAL USERNAME
const USERNAME = 'danielaguilar112'; 
const BASE_URL = 'https://mec402.boisestate.edu/csclasses/cs402/codesnips';

export default function SimpleListApp() {
  // State for the Core App
  const [lists, setLists] = useState({ Personal: [], Work: [], Groceries: [] });
  const [activeTab, setActiveTab] = useState('Personal');
  const [inputValue, setInputValue] = useState('');

  // State for Extra Credit: Proxy Cache
  const [cache, setCache] = useState({}); 
  const [totalSize, setTotalSize] = useState(0);

  // State for Virtualization
  const [scrollTop, setScrollTop] = useState(0);
  const containerHeight = 400;
  const itemHeight = 60;

  // --- 1. PROXY CACHE LOGIC (Extra Credit) ---

  const fetchListSize = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/listsize.php?user=${USERNAME}`);
      const size = await res.json();
      setTotalSize(Number(size) || 0);
    } catch (err) {
      console.error("Size fetch failed", err);
    }
  }, []);

  const fetchElement = async (index) => {
    if (cache[index]) return; // Don't fetch if already in memory

    try {
      const res = await fetch(`${BASE_URL}/getelement.php?user=${USERNAME}&item=${index}`);
      const itemData = await res.json();
      
      if (itemData && itemData.text) {
        setCache(prev => ({ ...prev, [index]: itemData }));
      }
    } catch (err) {
      console.error(`Error fetching item ${index}:`, err);
    }
  };

  // --- 2. REMOTE SAVE/LOAD (Core Assignment) ---

  const loadAllData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/loadjson.php?user=${USERNAME}`);
      const data = await res.json();
      if (data && typeof data === 'object') setLists(data);
    } catch (err) {
      console.error("Load failed:", err);
    }
  };

const saveAllData = async () => {
  try {
    const response = await fetch(`${BASE_URL}/savejson.php?user=${USERNAME}`, {
      method: 'POST',
      // Some school servers prefer 'text/plain' or no header at all to avoid pre-flight checks
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(lists)
    });

    if (response.ok) {
      alert("Success! Server file initialized.");
    } else {
      console.error("Server rejected the save:", response.status);
    }
  } catch (err) {
    console.error("Save error:", err);
  }
};

  // Initialize App
  useEffect(() => {
    const init = async () => {
      await fetchListSize();
      await loadAllData();
    };
    init();
  }, [fetchListSize]);

  // --- 3. ACTIONS ---

  const addItem = () => {
    if (!inputValue.trim()) return;
    const newItem = { id: Date.now(), text: inputValue, selected: false };
    const newList = [...(lists[activeTab] || []), newItem];
    setLists({ ...lists, [activeTab]: newList });
    setInputValue('');
  };

  const removeItem = (id) => {
    const newList = (lists[activeTab] || []).filter(i => i.id !== id);
    setLists({ ...lists, [activeTab]: newList });
  };

  // --- 4. VIRTUALIZATION CALCULATIONS ---
  const currentList = lists[activeTab] || [];
  // Use the larger of the two: local list size or remote totalSize (for EC)
  const displayCount = Math.max(currentList.length, totalSize);
  
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = startIndex + Math.ceil(containerHeight / itemHeight) + 1;
  
  // Create a slice of indexes to render
  const visibleIndices = Array.from(
    { length: Math.min(endIndex - startIndex, displayCount - startIndex) },
    (_, i) => startIndex + i
  );

  return (
    <div className="screen-wrapper">
      <div className="app-card">
        <h2>🌐 TaskMaster: {USERNAME}</h2>

        <div className="remote-controls">
          <button onClick={loadAllData} className="action-btn">📥 Load</button>
          <button onClick={saveAllData} className="action-btn save">💾 Save</button>
        </div>

        <div className="tab-bar">
          {Object.keys(lists).map(tab => (
            <button 
              key={tab} 
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab); setScrollTop(0); }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="input-group">
          <input 
            value={inputValue} 
            onChange={e => setInputValue(e.target.value)} 
            onKeyPress={e => e.key === 'Enter' && addItem()}
            placeholder="Add a new task..." 
          />
          <button onClick={addItem} className="add-btn">Add</button>
        </div>

        {/* Virtualized Container */}
        <div 
          className="list-container" 
          onScroll={(e) => setScrollTop(e.target.scrollTop)}
          style={{ height: `${containerHeight}px`, overflowY: 'auto', position: 'relative' }}
        >
          {/* Invisible spacer to make the scrollbar the correct length */}
          <div style={{ height: `${displayCount * itemHeight}px`, position: 'relative' }}>
            {visibleIndices.map((actualIndex) => {
  // EXTRA CREDIT FIX: 
  // We check the CACHE first. If it's not there, we fetch it.
  // This ensures the 'getelement.php' calls happen as you scroll.
  const cachedItem = cache[actualIndex];

  if (!cachedItem) {
    fetchElement(actualIndex);
  }

  // Fallback to localItem only if cache is still loading
  const localItem = currentList[actualIndex];
  const displayText = cachedItem?.text || localItem?.text || "⏳ Loading...";
  const displayId = cachedItem?.id || localItem?.id || `temp-${actualIndex}`;

  return (
    <div 
      key={displayId} 
      className="list-item" 
      style={{ 
        position: 'absolute', 
        top: `${actualIndex * itemHeight}px`, 
        width: '100%',
        height: `${itemHeight}px`
      }}
    >
      <span className="item-text">{displayText}</span>
      <button className="delete-btn" onClick={() => removeItem(displayId)}>🗑️</button>
    </div>
  );
})}
          </div>
        </div>
      </div>
    </div>
  );
}