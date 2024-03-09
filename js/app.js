import { createNewNote,  populateAndSortSidebar } from "./functions.js";

document.addEventListener("DOMContentLoaded", function () {
   
    // Fetch JSON data using XMLHttpRequest
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/data/notes.json", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var data = JSON.parse(xhr.responseText);
            populateAndSortSidebar(data);
        }
    };
    xhr.send();

    // Event listeners
    const createNotesBtn = document.querySelector(".add-notes");
    const notesDisplay = document.querySelector("#note-modal");
    const closeButton = document.querySelector(".close-button");
    const cancelButton = document.querySelector(".cancel-button");
    const createButton = document.querySelector(".create-button");
    const addActionItemButton = document.querySelector(".add-action-item-button");
    const addActionItemInput = document.querySelector(".add-action-item");
    const addedActionItemsContainer = document.querySelector(".added-action-items");
    // const actionItemsContainer = document.querySelector(".action-items-container");
    // const notesSidebarContainer = document.getElementById("notes-sidebar-container");

    // Event listener for the "Add Action Items" button
    addActionItemButton.addEventListener("click", function () {
        // Get the value of the action item input
        const actionItemText = addActionItemInput.value.trim();

        if (actionItemText !== "") {
            // Create a new div element to display the action item with a delete button
            const actionItemDiv = document.createElement("div");
            actionItemDiv.classList.add("action-item");

            const actionItemTextSpan = document.createElement("span");
            actionItemTextSpan.textContent = actionItemText;
            actionItemTextSpan.classList.add("new-action-item");
            actionItemDiv.appendChild(actionItemTextSpan);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "X";
            deleteButton.classList.add("delete-action-item-button");

            // Event listener for the delete button
            deleteButton.addEventListener("click", function () {
                actionItemDiv.remove();
            });

            actionItemDiv.appendChild(deleteButton);

            // Append the action item to the added action items container
            addedActionItemsContainer.appendChild(actionItemDiv);

            // Clear the input field
            addActionItemInput.value = "";
        }
    });

    // Event listener for the "Create Note" button
    createNotesBtn.addEventListener("click", function () {
        // Reset modal state
        notesDisplay.classList.remove("transitionStateModal");

        // Display the modal
        notesDisplay.style.display = "block";

        // Timeout for CSS transition for modal
        setTimeout(function () {
            notesDisplay.classList.add("transitionStateModal");
        }, 50);
    });

    // Event listener for the close button in the modal
    closeButton.addEventListener("click", function () {
        // Clear the input fields
        document.querySelector(".notes-create-title").value = "";
        document.querySelector(".notes-create-content").value = "";
        // Clear the added action items container
        addedActionItemsContainer.innerHTML = "";
        
        // Hide the modal
        notesDisplay.style.display = "none";
        });

    // Event listener for the cancel button in the modal
    cancelButton.addEventListener("click", function () {
        // Clear the input fields
        document.querySelector(".notes-create-title").value = "";
        document.querySelector(".notes-create-content").value = "";
        // Clear the added action items container
        addedActionItemsContainer.innerHTML = "";
        
        // Hide the modal
        notesDisplay.style.display = "none";
        });

    // Event listener for the create button in the modal
    createButton.addEventListener("click", function () {
        // Create a new note
        createNewNote();

        // Clear the input fields
        document.querySelector(".notes-create-title").value = "";
        document.querySelector(".notes-create-content").value = "";
        // Clear the added action items container
        addedActionItemsContainer.innerHTML = "";
        
        // Hide the modal
        notesDisplay.style.display = "none";
    });
});