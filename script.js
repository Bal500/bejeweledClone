document.addEventListener("DOMContentLoaded", function () {
    const board = document.getElementById("board");
    const scoreDisplay = document.getElementById("score");
    const timerDisplay = document.getElementById("timer");

    const colors = ["red", "blue", "green", "yellow", "purple"]; // Add more colors if needed
    const gridSize = 8; // Adjust grid size as desired
    let score = 0;
    let timer = 300; // 5 minutes in seconds

    let selectedGem = null;

    // Initialize the game board
    function createBoard() {
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const gem = document.createElement("div");
                gem.classList.add("gem");
                gem.dataset.color = colors[Math.floor(Math.random() * colors.length)];
                gem.style.setProperty("--random-color", gem.dataset.color); // Set random color
                gem.addEventListener("click", handleGemClick);
                board.appendChild(gem);
            }
        }
    }

    // Handle gem click
    function handleGemClick(e) {
        const clickedGem = e.target;

        if (!selectedGem) {
            selectedGem = clickedGem;
            selectedGem.classList.add("selected");
        } else {
            const validMove = isValidMove(selectedGem, clickedGem);
            if (validMove) {
                swapGems(selectedGem, clickedGem);
                checkMatches();
            } else {
                // Invalid move animation
                selectedGem.classList.add("invalid");
                clickedGem.classList.add("invalid");
                setTimeout(() => {
                    selectedGem.classList.remove("invalid");
                    clickedGem.classList.remove("invalid");
                }, 300);
            }
            selectedGem.classList.remove("selected");
            selectedGem = null;
        }
    }

    // Check if the move is valid
    function isValidMove(gem1, gem2) {
        const gem1Index = Array.from(board.children).indexOf(gem1);
        const gem2Index = Array.from(board.children).indexOf(gem2);

        // Check if gems are adjacent
        const gem1Row = Math.floor(gem1Index / gridSize);
        const gem1Col = gem1Index % gridSize;
        const gem2Row = Math.floor(gem2Index / gridSize);
        const gem2Col = gem2Index % gridSize;

        const isAdjacent = Math.abs(gem1Row - gem2Row) + Math.abs(gem1Col - gem2Col) === 1;

        if (!isAdjacent) return false;

        // Swap gem elements for validation
        const tempGem = gem1.cloneNode(true);
        gem1.parentNode.replaceChild(tempGem, gem1);
        gem2.parentNode.replaceChild(gem1, gem2);
        board.insertBefore(gem2, tempGem);
        gem2.style.transform = ""; // Clear any transform from previous animations

        // Check for matches after the potential swap
        const validMove = checkMatches();

        // Swap back the gems to their original positions
        board.insertBefore(gem1, gem2);
        gem1.parentNode.replaceChild(gem2, tempGem);

        return validMove;
    }

    // Check for consecutive gems of the same color
    function checkMatches() {
        const gems = Array.from(board.children);
    
        // Check horizontally
        for (let i = 0; i < gridSize; i++) {
            let consecutiveCount = 1;
            for (let j = 1; j < gridSize; j++) {
                const currentGem = gems[i * gridSize + j];
                const prevGem = gems[i * gridSize + j - 1];
                if (currentGem.dataset.color === prevGem.dataset.color) {
                    consecutiveCount++;
                } else {
                    consecutiveCount = 1;
                }
    
                if (consecutiveCount >= 3) {
                    setTimeout(() => {
                        for (let k = j; k >= j - consecutiveCount; k--) {
                            gems[i * gridSize + k].classList.add("matched");
                            gems[i * gridSize + k].dataset.color = colors[Math.floor(Math.random() * colors.length)];
                            gems[i * gridSize + k].style.setProperty("--random-color", gems[i * gridSize + k].dataset.color);
                            score += 50;
                        }
                    }, 1000);
                }
            }
        }
    
        // Check vertically
        for (let j = 0; j < gridSize; j++) {
            let consecutiveCount = 1;
            for (let i = 1; i < gridSize; i++) {
                const currentGem = gems[i * gridSize + j];
                const prevGem = gems[(i - 1) * gridSize + j];
                if (currentGem.dataset.color === prevGem.dataset.color) {
                    consecutiveCount++;
                } else {
                    consecutiveCount = 1;
                }
    
                if (consecutiveCount >= 3) {
                    // Match found, remove gems
                    for (let k = i; k >= i - consecutiveCount; k--) {
                        gems[k * gridSize + j].classList.add("matched");
                        gems[k * gridSize + j].dataset.color = colors[Math.floor(Math.random() * colors.length)];
                        gems[k * gridSize + j].style.setProperty("--random-color", gems[k * gridSize + j].dataset.color);
                        score += 50;
                    }
                }
            }
        }
    
        // Check diagonally (from top-left to bottom-right)
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                let consecutiveCount = 1;
                let x = i;
                let y = j;
                while (x < gridSize - 1 && y < gridSize - 1 && gems[x * gridSize + y].dataset.color === gems[(x + 1) * gridSize + y + 1].dataset.color) {
                    consecutiveCount++;
                    x++;
                    y++;
                }
    
                if (consecutiveCount >= 3) {
                    // Match found, remove gems
                    for (let k = 0; k < consecutiveCount; k++) {
                        gems[(i + k) * gridSize + j + k].classList.add("matched");
                        gems[(i + k) * gridSize + j + k].dataset.color = colors[Math.floor(Math.random() * colors.length)];
                        gems[(i + k) * gridSize + j + k].style.setProperty("--random-color", gems[(i + k) * gridSize + j + k].dataset.color);
                        score += 50;
                    }
                }
            }
        }
    
        // Remove matched gems
        const matchedGems = document.querySelectorAll(".matched");
        matchedGems.forEach((gem) => {
            gem.classList.remove("matched");
            gem.dataset.color = colors[Math.floor(Math.random() * colors.length)];
            gem.style.setProperty("--random-color", gem.dataset.color);
            score += 50;
        });
    
        // Update score display
        scoreDisplay.textContent = score;
    }

    // Swap gems between two elements
    function swapGems(gem1, gem2) {
        const tempColor = gem1.dataset.color;
        gem1.dataset.color = gem2.dataset.color;
        gem2.dataset.color = tempColor;

        // Animate the swap
        gem1.style.transition = "transform 0.5s ease";
        gem2.style.transition = "transform 0.5s ease";
        gem1.style.transform = `translate(0, -${gem2.clientHeight}px)`;
        gem2.style.transform = `translate(0, ${gem1.clientHeight}px)`;

        // Update colors after the swap
        gem1.style.setProperty("--random-color", gem1.dataset.color);
        gem2.style.setProperty("--random-color", gem2.dataset.color);
    }

    // Countdown timer and end game logic
    function startTimer() {
        const interval = setInterval(() => {
            timer--;
            timerDisplay.textContent = timer;
            if (timer === 0) {
                clearInterval(interval);
                endGame();
            }
        }, 1000);
    }

    function endGame() {
        alert(`Game over! Your score: ${score}`);
    }

    createBoard();
    startTimer();
});
