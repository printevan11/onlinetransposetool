const addSongForm = document.getElementById('addSongForm');
const songList = document.getElementById('songList');
const fullscreenModal = document.getElementById('fullscreenModal');
const fullscreenContent = document.getElementById('fullscreenContent');
const closeFullscreen = document.getElementById('closeFullscreen');

addSongForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const songTitle = document.getElementById('songTitle').value;
    const songKey = document.getElementById('songKey').value;
    const songChords = document.getElementById('songChords').value;

    const songItem = document.createElement('div');
    songItem.classList.add('chord-item', 'mb-4', 'p-4', 'border', 'border-gray-300', 'rounded-lg');

    const songTitleElement = document.createElement('h3');
    songTitleElement.classList.add('text-xl', 'font-bold', 'mb-2');
    songTitleElement.textContent = songTitle;

    const songKeyElement = document.createElement('p');
    songKeyElement.classList.add('text-gray-700', 'mb-2');
    songKeyElement.textContent = `Key: ${songKey}`;

    const songChordsElement = document.createElement('pre');
    songChordsElement.classList.add('bg-gray-100', 'p-2', 'rounded-lg', 'mb-2');
    songChordsElement.textContent = songChords;
    songChordsElement.style.display = 'none';

    const chordButtons = document.createElement('div');
    chordButtons.classList.add('chord-buttons');
    chordButtons.style.display = 'none';

    const transposeButton = document.createElement('button');
    transposeButton.classList.add('bg-green-500', 'text-white', 'px-4', 'py-2', 'rounded-lg');
    transposeButton.textContent = 'Transpose +1';
    transposeButton.addEventListener('click', function(event) {
        event.stopPropagation();
        const transposedChords = transposeChords(songChordsElement.textContent, 1);
        songChordsElement.textContent = transposedChords.chords;
        songKeyElement.textContent = `Key: ${transposedChords.key}`;
    });

    const transposeButtonMinus = document.createElement('button');
    transposeButtonMinus.classList.add('bg-red-500', 'text-white', 'px-4', 'py-2', 'rounded-lg');
    transposeButtonMinus.textContent = 'Transpose -1';
    transposeButtonMinus.addEventListener('click', function(event) {
        event.stopPropagation();
        const transposedChords = transposeChords(songChordsElement.textContent, -1);
        songChordsElement.textContent = transposedChords.chords;
        songKeyElement.textContent = `Key: ${transposedChords.key}`;
    });

    chordButtons.appendChild(transposeButton);
    chordButtons.appendChild(transposeButtonMinus);

    const actionButtons = document.createElement('div');
    actionButtons.classList.add('action-buttons');

    const editButton = document.createElement('button');
    editButton.classList.add('bg-yellow-500', 'text-white', 'px-4', 'py-2', 'rounded-lg');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', function(event) {
        event.stopPropagation();
        document.getElementById('songTitle').value = songTitle;
        document.getElementById('songKey').value = songKey;
        document.getElementById('songChords').value = songChords;
        songList.removeChild(songItem);
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('bg-red-500', 'text-white', 'px-4', 'py-2', 'rounded-lg');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function(event) {
        event.stopPropagation();
        songList.removeChild(songItem);
    });

    actionButtons.appendChild(editButton);
    actionButtons.appendChild(deleteButton);

    songItem.appendChild(songTitleElement);
    songItem.appendChild(songKeyElement);
    songItem.appendChild(songChordsElement);
    songItem.appendChild(chordButtons);
    songItem.appendChild(actionButtons);

    songItem.addEventListener('click', function() {
        fullscreenContent.innerHTML = `
            <h3 class="text-xl font-bold mb-2">${songTitle}</h3>
            <p class="text-gray-700 mb-2">Key: ${songKey}</p>
            <pre class="bg-gray-100 p-2 rounded-lg mb-2">${songChords}</pre>
            <div class="chord-buttons">
                <button class="bg-green-500 text-white px-4 py-2 rounded-lg" onclick="transposeFullscreenChords(1)">Transpose +1</button>
                <button class="bg-red-500 text-white px-4 py-2 rounded-lg" onclick="transposeFullscreenChords(-1)">Transpose -1</button>
            </div>
        `;
        fullscreenModal.style.display = 'flex';
    });

    songList.appendChild(songItem);

    addSongForm.reset();
});

closeFullscreen.addEventListener('click', function() {
    fullscreenModal.style.display = 'none';
    fullscreenContent.innerHTML = '';
});

function transposeChords(chords, steps) {
    const chordMap = {
        'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
    };
    const reverseChordMap = {
        0: 'C', 1: 'C#', 2: 'D', 3: 'D#', 4: 'E', 5: 'F', 6: 'F#', 7: 'G', 8: 'G#', 9: 'A', 10: 'A#', 11: 'B'
    };

    const transposedChords = chords.split('\n').map(line => {
        return line.split(/\s+/).map(chord => {
            const baseChord = chord.match(/[A-G][#b]?/);
            if (baseChord) {
                const transposedChord = reverseChordMap[(chordMap[baseChord[0]] + steps + 12) % 12];
                return chord.replace(baseChord[0], transposedChord);
            }
            return chord;
        }).join(' ');
    }).join('\n');

    const keyMatch = chords.match(/[A-G][#b]?/);
    let transposedKey = '';
    if (keyMatch) {
        transposedKey = reverseChordMap[(chordMap[keyMatch[0]] + steps + 12) % 12];
    }

    return { chords: transposedChords, key: transposedKey };
}

function transposeFullscreenChords(steps) {
    const preElement = fullscreenContent.querySelector('pre');
    const keyElement = fullscreenContent.querySelector('p');
    const transposedChords = transposeChords(preElement.textContent, steps);
    preElement.textContent = transposedChords.chords;
    keyElement.textContent = `Key: ${transposedChords.key}`;
}