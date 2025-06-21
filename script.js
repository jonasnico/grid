class GridPatternTool {
  constructor() {
    this.gridSize = 20;
    this.zoom = 1;
    this.activePattern = new Set();
    this.history = [];
    this.historyIndex = -1;
    this.maxHistorySize = 50;
    this.isDragging = false;
    this.dragMode = null;

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
    this.gridSizeSelect.addEventListener("change", () => {
      const newGridSize = parseInt(this.gridSizeSelect.value);
      this.changeGridSize(newGridSize);
    });

    this.zoomSlider.addEventListener("input", () => {
      this.zoom = parseFloat(this.zoomSlider.value);
      this.updateZoom();
    });

    this.clearBtn.addEventListener("click", () => this.clearGrid());
    this.undoBtn.addEventListener("click", () => this.undo());
    this.redoBtn.addEventListener("click", () => this.redo());
    this.saveBtn.addEventListener("click", () => this.savePattern());
    this.loadBtn.addEventListener("click", () => this.fileInput.click());
    this.fileInput.addEventListener("change", (e) => this.loadPattern(e));

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

    const baseSize = Math.max(15, Math.min(30, 600 / this.gridSize));
    const cellSize = baseSize * this.zoom;

    this.gridElement.style.gridTemplateColumns = `repeat(${this.gridSize}, ${cellSize}px)`;
    this.gridElement.style.gridTemplateRows = `repeat(${this.gridSize}, ${cellSize}px)`;

    for (let i = 0; i < this.gridSize * this.gridSize; i++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.index = i;
      cell.style.width = `${cellSize}px`;
      cell.style.height = `${cellSize}px`;

      cell.addEventListener("mousedown", (e) => {
        e.preventDefault();
        this.isDragging = true;
        this.dragMode = this.activePattern.has(i) ? "deactivate" : "activate";
        document.body.classList.add("dragging");
        this.handleCellInteraction(i, true);
      });

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

    this.updateDisplay();
    this.updateCellAppearance();

    setTimeout(() => {
      this.gridElement.classList.remove("changing");
    }, 300);
  }

  handleCellInteraction(index, isClick) {
    const wasActive = this.activePattern.has(index);
    let changed = false;

    if (isClick) {
      if (wasActive) {
        this.activePattern.delete(index);
        changed = true;
      } else {
        this.activePattern.add(index);
        changed = true;
      }
    } else if (this.isDragging) {
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
    this.history = this.history.slice(0, this.historyIndex + 1);

    const state = {
      pattern: new Set(this.activePattern),
      gridSize: this.gridSize,
    };
    this.history.push(state);
    this.historyIndex++;

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
    event.target.value = "";
  }
  showMessage(message, type = "info") {
    const messageEl = document.createElement("div");
    messageEl.textContent = message;
    messageEl.className = "message-notification";

    let backgroundColor;
    switch (type) {
      case "error":
        backgroundColor = "#e74c3c";
        break;
      case "success":
        backgroundColor = "#27ae60";
        break;
      case "info":
        backgroundColor = "#3498db";
        break;
      default:
        backgroundColor = "#27ae60";
    }

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
            background: ${backgroundColor};
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            max-width: 300px;
            word-wrap: break-word;
            margin-right: 10px;
        `;

    document.body.appendChild(messageEl);

    setTimeout(() => {
      messageEl.style.animation = "slideOut 0.3s ease";
      setTimeout(() => {
        document.body.removeChild(messageEl);
      }, 300);
    }, 3000);
  }

  changeGridSize(newGridSize) {
    const oldGridSize = this.gridSize;
    const oldPattern = new Set(this.activePattern);

    if (newGridSize < oldGridSize) {
      const offsetRow = Math.floor((oldGridSize - newGridSize) / 2);
      const offsetCol = Math.floor((oldGridSize - newGridSize) / 2);

      const willLoseData = Array.from(oldPattern).some((index) => {
        const row = Math.floor(index / oldGridSize);
        const col = index % oldGridSize;

        const adjustedRow = row - offsetRow;
        const adjustedCol = col - offsetCol;

        return (
          adjustedRow < 0 ||
          adjustedRow >= newGridSize ||
          adjustedCol < 0 ||
          adjustedCol >= newGridSize
        );
      });

      if (willLoseData) {
        const confirmMessage = `Å redusere rutenettet fra ${oldGridSize}x${oldGridSize} til ${newGridSize}x${newGridSize} vil fjerne deler av mønsteret som ikke passer i det sentrale området. Vil du fortsette?`;
        if (!confirm(confirmMessage)) {
          this.gridSizeSelect.value = oldGridSize;
          return;
        }
      }
    }

    const newPattern = new Set();

    const offsetRow = Math.floor((newGridSize - oldGridSize) / 2);
    const offsetCol = Math.floor((newGridSize - oldGridSize) / 2);

    for (const index of oldPattern) {
      const row = Math.floor(index / oldGridSize);
      const col = index % oldGridSize;

      if (newGridSize >= oldGridSize) {
        const newRow = row + offsetRow;
        const newCol = col + offsetCol;
        const newIndex = newRow * newGridSize + newCol;
        newPattern.add(newIndex);
      } else {
        const adjustedRow = row - offsetRow;
        const adjustedCol = col - offsetCol;

        if (
          adjustedRow >= 0 &&
          adjustedRow < newGridSize &&
          adjustedCol >= 0 &&
          adjustedCol < newGridSize
        ) {
          const newIndex = adjustedRow * newGridSize + adjustedCol;
          newPattern.add(newIndex);
        }
      }
    }

    this.gridSize = newGridSize;
    this.activePattern = newPattern;

    this.createGrid();
    this.saveState();

    if (newGridSize > oldGridSize) {
      this.showMessage(
        `Rutenett utvidet til ${newGridSize}x${newGridSize}. Mønster sentrert!`,
        "success"
      );
    } else if (newGridSize < oldGridSize) {
      this.showMessage(
        `Rutenett redusert til ${newGridSize}x${newGridSize}. Sentralt område bevart!`,
        "info"
      );
    }
  }
}

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
    
    @media (max-width: 768px) {
        .message-notification {
            top: 10px !important;
            right: 10px !important;
            left: 10px !important;
            max-width: none !important;
            margin-right: 0 !important;
        }
    }
`;
document.head.appendChild(style);

document.addEventListener("DOMContentLoaded", () => {
  new GridPatternTool();
});
