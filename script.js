const modal = document.getElementById('profileModal');

const openModalButton = document.getElementById('open-profile-modal'); 

const closeButton = document.querySelector('.close');

const cancelButton = document.getElementById('cancel-button');

openModalButton.onclick = function() {
    modal.style.display = 'block';
}

closeButton.onclick = function() {
    modal.style.display = 'none';
}

cancelButton.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}
