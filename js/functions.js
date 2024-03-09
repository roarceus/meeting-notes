import { getActionItems, displayNoteInSidebar, displayNote, truncateContent } from "./externalFunctions.js";

export function createNewNote() {
    // Get the values from the input fields
    const noteTitle = document.querySelector(".notes-create-title").value.trim();
    const noteContent = document.querySelector(".notes-create-content").value.trim();

    if (noteTitle !== "" && noteContent !== "") {
        // Create a new note object
        const newNote = {
            title: noteTitle,
            content: noteContent,
            action_items: getActionItems(),
            timestamp: new Date().toISOString()
        };

        // Display the new note in the sidebar
        displayNoteInSidebar(newNote);
        
    }
}

export function populateAndSortSidebar(data) {
    var notesSidebarContainer = document.getElementById('notes-sidebar-container');

    // Clear existing content
    notesSidebarContainer.innerHTML = '';

    // Sort data based on timestamp (newest to oldest)
    data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Iterate through the sorted JSON data and populate the sidebar
    data.forEach(function (item) {
        var noteItem = document.createElement('div');
        noteItem.classList.add('notes-list-item');

        var title = document.createElement('div');
        title.classList.add('notes-sidebar-title');
        title.textContent = item.title;

        var content = document.createElement('div');
        content.classList.add('notes-sidebar-content');
        content.textContent = truncateContent(item.content);

        var timestamp = document.createElement('div');
        timestamp.classList.add('notes-sidebar-timestamp');
        timestamp.textContent = new Date(item.timestamp).toLocaleString();

        noteItem.appendChild(title);
        noteItem.appendChild(content);
        noteItem.appendChild(timestamp);

        // Event listener to display the selected note in the notes-display section
        noteItem.addEventListener('click', function () {
            displayNote(item);
        });

        notesSidebarContainer.appendChild(noteItem);
    });
}