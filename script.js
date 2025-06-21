class GridPatternTool {
  constructor() {
    this.gridSize = 20;
    this.zoom = 1;
    this.activePattern = new Set();
    this.history = [];
    this.historyIndex = -1;
    this.maxHistorySize = 50;
    this.isDragging = false;
    this.dragMode = null; // 'activate' or 'deactivate'

    this.initializeElements();
    this.setupEventListeners();
    this.createGrid();
    this.saveState();
  }

  initializeElements() {
    this.gridElement = document.getElementById("grid");
    this.gridSizeSelect = document.getElementById("gridSize");
    this.zoomSlider = document.getElementById("zoom");
    this.zoomValue = document.getElementById("zoomValue");
    this.clearBtn = document.getElementById("clearGrid");
    this.undoBtn = document.getElementById("undoBtn");
    this.redoBtn = document.getElementById("redoBtn");
    this.saveBtn = document.getElementById("savePattern");
    this.loadBtn = document.getElementById("loadPattern");
    this.fileInput = document.getElementById("fileInput");
    this.activeCount = document.getElementById("activeCount");
    this.totalCount = document.getElementById("totalCount");
  }

  setupEventListeners() {
    // Grid size change
    this.gridSizeSelect.addEventListener("change", () => {
      this.gridSize = parseInt(this.gridSizeSelect.value);
      this.createGrid();
      this.saveState();
    });

    // Zoom control
    this.zoomSlider.addEventListener("input", () => {
      this.zoom = parseFloat(this.zoomSlider.value);
      this.updateZoom();
    });

    // Control buttons
    this.clearBtn.addEventListener("click", () => this.clearGrid());
    this.undoBtn.addEventListener("click", () => this.undo());
    this.redoBtn.addEventListener("click", () => this.redo());
    this.saveBtn.addEventListener("click", () => this.savePattern());
    this.loadBtn.addEventListener("click", () => this.fileInput.click());
    this.fileInput.addEventListener("change", (e) => this.loadPattern(e));

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "z":
            e.preventDefault();
            if (e.shiftKey) {
              this.redo();
            } else {
              this.undo();
            }
            break;
          case "y":
            e.preventDefault();
            this.redo();
            break;
          case "s":
            e.preventDefault();
            this.savePattern();
            break;
        }
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        this.clearGrid();
      }
    });

    // Global mouse events for drag support
    document.addEventListener("mouseup", () => {
      if (this.isDragging) {
        this.saveState();
        document.body.classList.remove("dragging");
      }
      this.isDragging = false;
      this.dragMode = null;
    });

    document.addEventListener("mouseleave", () => {
      if (this.isDragging) {
        this.saveState();
        document.body.classList.remove("dragging");
      }
      this.isDragging = false;
      this.dragMode = null;
    });

    // Global mousemove for continuous drawing
    document.addEventListener("mousemove", (e) => {
      if (this.isDragging) {
        const elementFromPoint = document.elementFromPoint(
          e.clientX,
          e.clientY
        );
        if (elementFromPoint && elementFromPoint.classList.contains("cell")) {
          const index = parseInt(elementFromPoint.dataset.index);
          this.handleCellInteraction(index, false);
        }
      }
    });
  }

  createGrid() {
    this.gridElement.innerHTML = "";
    this.gridElement.className = "grid changing";

    // Calculate cell size based on zoom and grid size
    const baseSize = Math.max(15, Math.min(30, 600 / this.gridSize));
    const cellSize = baseSize * this.zoom;

    this.gridElement.style.gridTemplateColumns = `repeat(${this.gridSize}, ${cellSize}px)`;
    this.gridElement.style.gridTemplateRows = `repeat(${this.gridSize}, ${cellSize}px)`;

    // Create cells
    for (let i = 0; i < this.gridSize * this.gridSize; i++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.index = i;
      cell.style.width = `${cellSize}px`;
      cell.style.height = `${cellSize}px`;

      // Mouse events for clicking and dragging
      cell.addEventListener("mousedown", (e) => {
        e.preventDefault();
        this.isDragging = true;
        this.dragMode = this.activePattern.has(i) ? "deactivate" : "activate";
        document.body.classList.add("dragging");
        this.handleCellInteraction(i, true);
      });

      // Touch events for mobile support
      cell.addEventListener("touchstart", (e) => {
        e.preventDefault();
        this.isDragging = true;
        this.dragMode = this.activePattern.has(i) ? "deactivate" : "activate";
        this.handleCellInteraction(i, true);
      });

      cell.addEventListener("touchmove", (e) => {
        e.preventDefault();
        if (this.isDragging) {
          const touch = e.touches[0];
          const elementFromPoint = document.elementFromPoint(
            touch.clientX,
            touch.clientY
          );
          if (elementFromPoint && elementFromPoint.classList.contains("cell")) {
            const index = parseInt(elementFromPoint.dataset.index);
            this.handleCellInteraction(index, false);
          }
        }
      });

      cell.addEventListener("touchend", () => {
        if (this.isDragging) {
          this.saveState();
          document.body.classList.remove("dragging");
        }
        this.isDragging = false;
        this.dragMode = null;
      });

      this.gridElement.appendChild(cell);
    }

    // Update display
    this.updateDisplay();
    this.updateCellAppearance();

    // Remove animation class after animation completes
    setTimeout(() => {
      this.gridElement.classList.remove("changing");
    }, 300);
  }

  handleCellInteraction(index, isClick) {
    const wasActive = this.activePattern.has(index);
    let changed = false;

    if (isClick) {
      // On click, toggle the cell
      if (wasActive) {
        this.activePattern.delete(index);
        changed = true;
      } else {
        this.activePattern.add(index);
        changed = true;
      }
    } else if (this.isDragging) {
      // On drag, follow the drag mode
      if (this.dragMode === "activate" && !wasActive) {
        this.activePattern.add(index);
        changed = true;
      } else if (this.dragMode === "deactivate" && wasActive) {
        this.activePattern.delete(index);
        changed = true;
      }
    }

    if (changed) {
      this.updateCellAppearance();
      this.updateDisplay();
    }
  }

  updateCellAppearance() {
    const cells = this.gridElement.querySelectorAll(".cell");
    cells.forEach((cell, index) => {
      if (this.activePattern.has(index)) {
        cell.classList.add("active");
      } else {
        cell.classList.remove("active");
      }
    });
  }

  updateZoom() {
    this.zoomValue.textContent = Math.round(this.zoom * 100) + "%";

    // Recalculate cell sizes
    const baseSize = Math.max(15, Math.min(30, 600 / this.gridSize));
    const cellSize = baseSize * this.zoom;

    this.gridElement.style.gridTemplateColumns = `repeat(${this.gridSize}, ${cellSize}px)`;
    this.gridElement.style.gridTemplateRows = `repeat(${this.gridSize}, ${cellSize}px)`;

    const cells = this.gridElement.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.style.width = `${cellSize}px`;
      cell.style.height = `${cellSize}px`;
    });
  }

  updateDisplay() {
    this.activeCount.textContent = this.activePattern.size;
    this.totalCount.textContent = this.gridSize * this.gridSize;

    // Update button states
    this.undoBtn.disabled = this.historyIndex <= 0;
    this.redoBtn.disabled = this.historyIndex >= this.history.length - 1;
  }

  clearGrid() {
    this.activePattern.clear();
    this.updateCellAppearance();
    this.updateDisplay();
    this.saveState();
  }

  saveState() {
    // Remove any history after current index
    this.history = this.history.slice(0, this.historyIndex + 1);

    // Add new state
    const state = {
      pattern: new Set(this.activePattern),
      gridSize: this.gridSize,
    };
    this.history.push(state);
    this.historyIndex++;

    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
      this.historyIndex--;
    }

    this.updateDisplay();
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      const state = this.history[this.historyIndex];
      this.activePattern = new Set(state.pattern);

      if (state.gridSize !== this.gridSize) {
        this.gridSize = state.gridSize;
        this.gridSizeSelect.value = this.gridSize;
        this.createGrid();
      } else {
        this.updateCellAppearance();
      }

      this.updateDisplay();
    }
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      const state = this.history[this.historyIndex];
      this.activePattern = new Set(state.pattern);

      if (state.gridSize !== this.gridSize) {
        this.gridSize = state.gridSize;
        this.gridSizeSelect.value = this.gridSize;
        this.createGrid();
      } else {
        this.updateCellAppearance();
      }

      this.updateDisplay();
    }
  }

  savePattern() {
    const pattern = {
      gridSize: this.gridSize,
      activePattern: Array.from(this.activePattern),
      timestamp: new Date().toISOString(),
      version: "1.0",
    };

    const dataStr = JSON.stringify(pattern, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(dataBlob);
    link.download = `grid-pattern-${this.gridSize}x${
      this.gridSize
    }-${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(link.href);
  }

  loadPattern(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const pattern = JSON.parse(e.target.result);

        if (pattern.gridSize && pattern.activePattern) {
          this.gridSize = pattern.gridSize;
          this.gridSizeSelect.value = this.gridSize;
          this.activePattern = new Set(pattern.activePattern);

          this.createGrid();
          this.saveState();

          // Show success message
          this.showMessage("Mønster lastet inn!", "success");
        } else {
          throw new Error("Ugyldig fil format");
        }
      } catch (error) {
        this.showMessage(
          "Feil ved lasting av mønster: " + error.message,
          "error"
        );
      }
    };

    reader.readAsText(file);
    event.target.value = ""; // Clear file input
  }

  showMessage(message, type = "info") {
    // Create message element
    const messageEl = document.createElement("div");
    messageEl.textContent = message;
    messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 6px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            background: ${type === "error" ? "#e74c3c" : "#27ae60"};
        `;

    document.body.appendChild(messageEl);

    // Remove after 3 seconds
    setTimeout(() => {
      messageEl.style.animation = "slideOut 0.3s ease";
      setTimeout(() => {
        document.body.removeChild(messageEl);
      }, 300);
    }, 3000);
  }
}

// Add CSS animations for messages
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the application when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new GridPatternTool();
});
