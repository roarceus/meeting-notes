import { populateAndSortSidebar } from "./functions.js";

// Function to make an array of action items
export function getActionItems() {
    const actionItems = [];
    const actionItemElements = document.querySelectorAll(".added-action-items .action-item span");

    actionItemElements.forEach((item) => {
        actionItems.push(item.textContent);
    });

    return actionItems;
}


// Function to populate sidebar
const notesSidebarContainer = document.getElementById("notes-sidebar-container");
export function displayNoteInSidebar(note) {
    var notesSidebarContainer = document.getElementById('notes-sidebar-container');

    // Create a new note item
    var noteItem = document.createElement('div');
    noteItem.classList.add('notes-list-item');

    // Create title element
    var title = document.createElement('div');
    title.classList.add('notes-sidebar-title');
    title.textContent = note.title;

    // Create content element and truncate content
    var content = document.createElement('div');
    content.classList.add('notes-sidebar-content');
    content.textContent = truncateContent(note.content);

    // Create timestamp element
    var timestamp = document.createElement('div');
    timestamp.classList.add('notes-sidebar-timestamp');
    timestamp.textContent = new Date(note.timestamp).toLocaleString();

    // Append items
    noteItem.appendChild(title);
    noteItem.appendChild(content);
    noteItem.appendChild(timestamp);

    // Add click event to display the selected note in the notes-display section
    noteItem.addEventListener('click', function () {
        displayNote(note);
    });

    // Prepend the new note to the sidebar container
    notesSidebarContainer.prepend(noteItem);
}

// Function to truncate content if it has more than 10 words
export function truncateContent(fullContent) {
    var words = fullContent.split(' ');
    if (words.length > 10) {
        return words.slice(0, 10).join(' ') + '...';
    } else {
        return fullContent;
    }
}

export function displayNote(note) {
    // Populate the notes-display section with the selected note
    var originalDisplayNote = document.querySelector('.notes-display');

    // Clone the original notes-display element
    var displayNote = originalDisplayNote.cloneNode(true);

    // Replace the original with the clone
    originalDisplayNote.parentNode.replaceChild(displayNote, originalDisplayNote);

    // Remove and re-add the 'transitionState' class to trigger the transition
    displayNote.classList.remove('transitionState');
    void displayNote.offsetWidth; // Trigger reflow
    displayNote.classList.add('transitionState');

    var displayTitle = document.querySelector('.notes-display-title');
    var displayContent = document.querySelector('.notes-display-content');
    var actionItemsSection = document.querySelector('.notes-display-action-items');

    displayTitle.value = note.title;
    displayContent.value = note.content;

    // Clear existing action items
    actionItemsSection.innerHTML = '';

    // Event listener for changes in the title
    displayTitle.addEventListener('input', function () {
        // Update the title property of the note object
        note.title = displayTitle.value;
        // Update the corresponding note in the sidebar
        updateNoteInSidebar(note);
    });

    // Event listener for changes in the content
    displayContent.addEventListener('input', function () {
        // Update the content property of the note object
        note.content = displayContent.value;
        // Update the corresponding note in the sidebar
        updateNoteInSidebar(note);
    });

    var actionItemsTitle = document.createElement('div');
    actionItemsTitle.classList.add('display-action-item-title');
    actionItemsTitle.textContent = 'Action Items';

    // Create a "+" button for adding new action items
    var addActionItemButton = document.createElement('button');

    addActionItemButton.textContent = '+';
    addActionItemButton.classList.add('display-action-item-button');
    addActionItemButton.addEventListener('click', function () {
        // Ask the user for input
        var newActionItem = prompt('Enter new action item:');

        // Check if the user entered a value
        if (newActionItem !== null && newActionItem.trim() !== '') {
            // Append the new action item to the existing ones
            note.action_items.push(newActionItem);

            // Refresh the display without triggering the transition
            displayNoteInternal(note);
        }
    });
    
    // Append action items title and button to the container
    actionItemsTitle.appendChild(addActionItemButton);
    actionItemsSection.appendChild(actionItemsTitle);

    // Display each action item with a checkbox and a delete button
    note.action_items.forEach(function (actionItem, index) {
        var actionItemContainer = document.createElement('div');
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'actionItemCheckbox_' + index;

        var label = document.createElement('label');
        label.textContent = actionItem;
        label.htmlFor = 'actionItemCheckbox_' + index;

        // Check if the action item was previously checked (strikethrough)
        if (note.checked_items && note.checked_items.includes(index)) {
            label.style.textDecoration = 'line-through';
            checkbox.checked = true;
        }

        // Add event listener to update the strikethrough style
        checkbox.addEventListener('change', function () {
            if (checkbox.checked) {
                label.style.textDecoration = 'line-through';
                // Save the checked state in the note object
                if (!note.checked_items) {
                    note.checked_items = [];
                }
                note.checked_items.push(index);
            } else {
                label.style.textDecoration = 'none';
                // Remove the checked state from the note object
                if (note.checked_items) {
                    note.checked_items = note.checked_items.filter(item => item !== index);
                }
            }
        });

        // Create delete button for each action item
        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-action-item-button');

        // Add event listener to delete the corresponding action item
        deleteButton.addEventListener('click', function () {
            // Remove the corresponding action item from the note
            note.action_items.splice(index, 1);
            // Refresh the display without triggering the transition
            displayNoteInternal(note);
        });

        // Append the new action item, checkbox, and label
        actionItemContainer.appendChild(checkbox);
        actionItemContainer.appendChild(label);
        
        // Append the delete button to the action item container
        actionItemContainer.appendChild(deleteButton);

        // Append the action item container to the action items section
        actionItemsSection.appendChild(actionItemContainer);
    });
}

// Function to update the corresponding note in the sidebar
function updateNoteInSidebar(updatedNote) {
    var notesSidebarContainer = document.getElementById('notes-sidebar-container');

    // Find the note element in the sidebar
    var noteElements = notesSidebarContainer.getElementsByClassName('notes-list-item');
    for (var i = 0; i < noteElements.length; i++) {
        var titleElement = noteElements[i].getElementsByClassName('notes-sidebar-title')[0];
        if (titleElement.textContent === updatedNote.title) {
            
            // Update the title and content in the sidebar
            var contentElement = noteElements[i].getElementsByClassName('notes-sidebar-content')[0];
            var timestampElement = noteElements[i].getElementsByClassName('notes-sidebar-timestamp')[0];
            
            // Update the title directly
            titleElement.textContent = updatedNote.title;

            // Update the content
            contentElement.textContent = truncateContent(updatedNote.content);

            timestampElement.textContent = new Date().toLocaleString();

            // If both title and content are updated, update the action items
            if (updatedNote.hasOwnProperty('action_items')) {
                var actionItemsContainer = noteElements[i].getElementsByClassName('notes-sidebar-action-items')[0];
                actionItemsContainer.innerHTML = ''; // Clear existing action items

                // Display each action item in the sidebar
                updatedNote.action_items.forEach(function (actionItem) {
                    var actionItemElement = document.createElement('div');
                    actionItemElement.textContent = actionItem;
                    actionItemsContainer.appendChild(actionItemElement);
                });
            }

            // Exit the loop since we found and updated the corresponding note
            break;
        }
    }
}


// Rename the internal function to avoid conflicts
function displayNoteInternal(note) {
    // Call the displayNote function without triggering the transition
    var originalDisplayNote = document.querySelector('.notes-display');
    var displayNote = originalDisplayNote.cloneNode(true);
    originalDisplayNote.parentNode.replaceChild(displayNote, originalDisplayNote);

    var displayTitle = document.querySelector('.notes-display-title');
    var displayContent = document.querySelector('.notes-display-content');
    var actionItemsSection = document.querySelector('.notes-display-action-items');

    displayTitle.value = note.title;
    displayContent.value = note.content;

    // Clear existing action items
    actionItemsSection.innerHTML = '';

    var actionItemsTitle = document.createElement('div');
    actionItemsTitle.classList.add('display-action-item-title');
    actionItemsTitle.textContent = 'Action Items';

    // Create a "+" button to add action items
    var addActionItemButton = document.createElement('button');

    addActionItemButton.textContent = '+';
    addActionItemButton.classList.add('display-action-item-button');
    addActionItemButton.addEventListener('click', function () {
        // Ask the user for input
        var newActionItem = prompt('Enter new action item:');

        // Check if the user entered a value
        if (newActionItem !== null && newActionItem.trim() !== '') {
            // Append the new action item to the existing ones
            note.action_items.push(newActionItem);

            // Refresh the display without triggering the transition
            displayNoteInternal(note);
        }
    });

    actionItemsTitle.appendChild(addActionItemButton);
    actionItemsSection.appendChild(actionItemsTitle);

    // Display each action item with a checkbox and a delete button
    note.action_items.forEach(function (actionItem, index) {
        var actionItemContainer = document.createElement('div');
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'actionItemCheckbox_' + index;

        var label = document.createElement('label');
        label.textContent = actionItem;
        label.htmlFor = 'actionItemCheckbox_' + index;

        // Check if the action item was previously checked (strikethrough)
        if (note.checked_items && note.checked_items.includes(index)) {
            label.style.textDecoration = 'line-through';
            checkbox.checked = true;
        }

        // Add event listener to update the strikethrough style
        checkbox.addEventListener('change', function () {
            if (checkbox.checked) {
                label.style.textDecoration = 'line-through';
                // Save the checked state in the note object
                if (!note.checked_items) {
                    note.checked_items = [];
                }
                note.checked_items.push(index);
            } else {
                label.style.textDecoration = 'none';
                // Remove the checked state from the note object
                if (note.checked_items) {
                    note.checked_items = note.checked_items.filter(item => item !== index);
                }
            }
        });

        // Create delete button for each action item
        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-action-item-button');

        // Add event listener to delete the corresponding action item
        deleteButton.addEventListener('click', function () {
            // Remove the corresponding action item from the note
            note.action_items.splice(index, 1);
            // Refresh the display without triggering the transition
            displayNoteInternal(note);
        });

        // Append the new action item, checkbox, label, and delete button
        actionItemContainer.appendChild(checkbox);
        actionItemContainer.appendChild(label);

        // Append the delete button to the action item container
        actionItemContainer.appendChild(deleteButton);

        // Append the action item container to the action items section
        actionItemsSection.appendChild(actionItemContainer);
    });
}
