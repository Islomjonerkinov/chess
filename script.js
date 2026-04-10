 const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('.content-section');

        function setActiveSection(targetId) {
            // Hide all sections
            sections.forEach(sec => sec.classList.add('hide-section'));
            
            // Show target section
            const targetSection = document.getElementById('sec-' + targetId);
            if(targetSection) {
                targetSection.classList.remove('hide-section');
            }

            // Update nav styles
            navItems.forEach(item => {
                if(item.dataset.target === targetId) {
                    item.classList.add('bg-neutral-900', 'border-neutral-800', 'text-neutral-100', 'shadow-sm');
                    item.classList.remove('text-neutral-500', 'border-transparent');
                } else {
                    item.classList.remove('bg-neutral-900', 'border-neutral-800', 'text-neutral-100', 'shadow-sm');
                    item.classList.add('text-neutral-500', 'border-transparent');
                }
            });
        }

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const target = item.dataset.target;
                setActiveSection(target);
            });
        });

        // Interactive Chessboard Logic
        const boardEl = document.getElementById('chessboard');
        
        // Piece layout: standard chess starting position
        // Lowercase = Black, Uppercase = White
        const initialBoard = [
            'r','n','b','q','k','b','n','r',
            'p','p','p','p','p','p','p','p',
            '','','','','','','','',
            '','','','','','','','',
            '','','','','','','','',
            '','','','','','','','',
            'P','P','P','P','P','P','P','P',
            'R','N','B','Q','K','B','N','R'
        ];

        let boardState = [...initialBoard];
        let selectedIdx = null;

        // Using solid unicode characters for both, differentiated by CSS color
        const pieceMap = {
            'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
            'R': '♜', 'N': '♞', 'B': '♝', 'Q': '♛', 'K': '♚', 'P': '♟'
        };

        function isWhite(piece) {
            return piece >= 'A' && piece <= 'Z';
        }

        function renderBoard() {
            boardEl.innerHTML = '';
            for (let i = 0; i < 64; i++) {
                const square = document.createElement('div');
                
                // Color logic: alternating based on row/col
                const row = Math.floor(i / 8);
                const col = i % 8;
                const isLight = (row + col) % 2 === 0;
                
                square.className = `chess-square ${isLight ? 'square-light' : 'square-dark'}`;
                if (i === selectedIdx) {
                    square.classList.add('selected');
                }

                // Add Piece
                const piece = boardState[i];
                if (piece) {
                    const pieceEl = document.createElement('span');
                    pieceEl.innerText = pieceMap[piece];
                    pieceEl.className = isWhite(piece) ? 'piece-white' : 'piece-black';
                    square.appendChild(pieceEl);
                }

                // Interaction
                square.addEventListener('click', () => handleSquareClick(i));
                
                // Highlight valid moves (simplified to just empty/capture pseudo-logic)
                if (selectedIdx !== null && selectedIdx !== i) {
                    // For demo: pretend everything except own pieces is a valid move
                    const selectedPiece = boardState[selectedIdx];
                    const targetPiece = boardState[i];
                    if (!targetPiece || (isWhite(selectedPiece) !== isWhite(targetPiece))) {
                       square.classList.add('valid-move');
                    }
                }

                boardEl.appendChild(square);
            }
        }

        function handleSquareClick(idx) {
            if (selectedIdx === null) {
                // Select a piece
                if (boardState[idx] !== '') {
                    selectedIdx = idx;
                }
            } else {
                // Clicking the same square deselects
                if (selectedIdx === idx) {
                    selectedIdx = null;
                } else {
                    const selectedPiece = boardState[selectedIdx];
                    const targetPiece = boardState[idx];
                    
                    // Allow move to empty square or enemy piece
                    if (!targetPiece || (isWhite(selectedPiece) !== isWhite(targetPiece))) {
                        boardState[idx] = boardState[selectedIdx];
                        boardState[selectedIdx] = '';
                        selectedIdx = null;
                    } else {
                        // Change selection to other own piece
                        selectedIdx = idx;
                    }
                }
            }
            renderBoard();
        }

        // Initialize
        renderBoard();