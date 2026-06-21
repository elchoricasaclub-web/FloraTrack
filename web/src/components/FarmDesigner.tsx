import React, { useState, useCallback } from 'react';
import { useComplianceStore } from '../store';
import { CropBatch } from '../types/agricultural';

interface GridCell {
  x: number;
  y: number;
  batchId?: string;
}

export const FarmDesigner: React.FC = () => {
  const { batches } = useComplianceStore();
  const [gridWidth] = useState(6);
  const [gridHeight] = useState(4);
  const [cells, setCells] = useState<GridCell[]>(
    Array.from({ length: gridWidth * gridHeight }).map((_, i) => ({
      x: i % gridWidth,
      y: Math.floor(i / gridWidth),
    }))
  );
  const [draggingBatchId, setDraggingBatchId] = useState<string | null>(null);

  // Initialize unplaced batches or simple fallback
  const placedBatchIds = new Set(cells.filter(c => c.batchId).map(c => c.batchId));
  const unplacedBatches = batches.filter(b => !placedBatchIds.has(b.id));

  // Initialize randomly for demo if none placed yet
  React.useEffect(() => {
    if (placedBatchIds.size === 0 && batches.length > 0) {
      setCells(prev => {
        const next = [...prev];
        let availableIdx = 0;
        batches.forEach(b => {
           // Skip if we run out of cells
           if (availableIdx >= next.length) return;
           next[availableIdx].batchId = b.id;
           availableIdx += 2; // Add some space between them
        });
        return next;
      });
    }
  }, [batches]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggingBatchId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropToCell = (e: React.DragEvent, x: number, y: number) => {
    e.preventDefault();
    if (!draggingBatchId) return;

    setCells((prev) => {
      const next = [...prev];
      // Find where it was
      const oldCellIdx = next.findIndex(c => c.batchId === draggingBatchId);
      if (oldCellIdx >= 0) {
        next[oldCellIdx] = { ...next[oldCellIdx], batchId: undefined };
      }
      
      // Find where we drop
      const newCellIdx = next.findIndex(c => c.x === x && c.y === y);
      if (newCellIdx >= 0) {
        // If there's something already there, swap them!
        const existingBatchId = next[newCellIdx].batchId;
        next[newCellIdx] = { ...next[newCellIdx], batchId: draggingBatchId };
        
        if (existingBatchId && oldCellIdx >= 0) {
          next[oldCellIdx] = { ...next[oldCellIdx], batchId: existingBatchId };
        }
      }
      return next;
    });
    setDraggingBatchId(null);
  };

  const handleDropToUnplaced = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggingBatchId) return;

    setCells((prev) => {
      const next = [...prev];
      const oldCellIdx = next.findIndex(c => c.batchId === draggingBatchId);
      if (oldCellIdx >= 0) {
        next[oldCellIdx] = { ...next[oldCellIdx], batchId: undefined };
      }
      return next;
    });
    setDraggingBatchId(null);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'CLONING': return 'bg-sky-500 text-white';
      case 'VEG': return 'bg-emerald-500 text-white';
      case 'FLOWER': return 'bg-indigo-500 text-white';
      case 'HARVEST': return 'bg-amber-500 text-white';
      case 'DRYING': return 'bg-orange-500 text-white';
      case 'CURING': return 'bg-rose-500 text-white';
      case 'PACKAGED': return 'bg-slate-700 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500"></div>
      
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Side: Unplaced Batches */}
        <div 
          className="w-full md:w-64 shrink-0 bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col gap-3 min-h-[300px]"
          onDragOver={handleDragOver}
          onDrop={handleDropToUnplaced}
        >
          <div className="space-y-1 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Banco de Lotes</span>
            <h4 className="text-sm font-bold text-white">Lotes sin Asignar</h4>
            <p className="text-[10px] text-slate-500">Arrastre lotes hacia la cuadrícula de la finca.</p>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto">
            {unplacedBatches.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[10px] uppercase font-bold text-slate-600 border-2 border-dashed border-slate-800 rounded-xl p-4 text-center">
                Todos los lotes están asignados
              </div>
            ) : (
              unplacedBatches.map(b => (
                <div
                  key={b.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, b.id)}
                  className={`p-3 rounded-xl cursor-move shadow-md flex flex-col gap-1 ${getStageColor(b.stage)} hover:brightness-110 active:scale-95 transition-all`}
                >
                  <span className="text-[9px] uppercase font-black tracking-wider opacity-80">{b.stage}</span>
                  <span className="font-bold text-sm tracking-tight">{b.batchCode}</span>
                  <span className="text-[10px] font-medium opacity-90 truncate">{b.variety}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: The Farm Grid */}
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="min-w-[600px] space-y-4">
            <div>
              <h4 className="text-lg font-black text-white tracking-tight">Esquema Operativo de la Finca</h4>
              <p className="text-xs text-slate-400">Diseñador interactivo tipo "Drag & Drop" para ubicar físicamente los lotes en cuadrantes.</p>
            </div>

            <div 
              className="grid gap-2"
              style={{ gridTemplateColumns: `repeat(${gridWidth}, minmax(0, 1fr))` }}
            >
              {cells.map(cell => {
                const batch = cell.batchId ? batches.find(b => b.id === cell.batchId) : null;
                
                return (
                  <div
                    key={`${cell.x}-${cell.y}`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropToCell(e, cell.x, cell.y)}
                    className="aspect-square bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center p-2 transition-all group"
                  >
                    {!batch ? (
                      <div className="w-full h-full border-2 border-dashed border-slate-800 rounded-xl flex items-center justify-center">
                        <span className="text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-xs">+</span>
                      </div>
                    ) : (
                      <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, batch.id)}
                        className={`w-full h-full rounded-xl cursor-move shadow-lg p-2.5 flex flex-col justify-center items-center text-center gap-1.5 ${getStageColor(batch.stage)} hover:shadow-xl hover:scale-105 active:scale-95 transition-all relative overflow-hidden`}
                      >
                        <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-0 hover:opacity-100 transition-opacity"></div>
                        <span className="text-[8px] uppercase font-black tracking-widest opacity-80 leading-none">{batch.stage}</span>
                        <span className="font-black text-xs md:text-sm tracking-tight leading-none text-white">{batch.batchCode.split('-').pop()}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};
