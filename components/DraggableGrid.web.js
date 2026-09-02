import { useRef, useState } from 'react';

/**
 * Two-column grid whose cells can be dragged to reorder (web only, HTML5 DnD).
 * `renderItem(item, index)` returns the cell content; `onReorder(from, to)`
 * commits a move. Native uses a static grid (see DraggableGrid.js).
 */
export default function DraggableGrid({ items, renderItem, onReorder }) {
  const from = useRef(null);
  const [overId, setOverId] = useState(null);

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 16,
        width: '100%',
      }}
    >
      {items.map((item, i) => (
        <div
          key={item.id}
          draggable
          onDragStart={(e) => {
            from.current = i;
            e.dataTransfer.effectAllowed = 'move';
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            if (overId !== item.id) setOverId(item.id);
          }}
          onDrop={(e) => {
            e.preventDefault();
            const start = from.current;
            if (start != null && start !== i) onReorder(start, i);
            from.current = null;
            setOverId(null);
          }}
          onDragEnd={() => {
            from.current = null;
            setOverId(null);
          }}
          style={{
            width: '48%',
            cursor: 'grab',
            borderRadius: 12,
            outline: overId === item.id ? '2px solid #14955D' : 'none',
            outlineOffset: 2,
          }}
        >
          {renderItem(item, i)}
        </div>
      ))}
    </div>
  );
}
