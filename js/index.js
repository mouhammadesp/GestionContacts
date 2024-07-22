document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("deviceready", onDeviceReady, false);
    onDeviceReady(); 

   
    document.getElementById("searchInput").addEventListener("input", function() {
        filtrerContacts(this.value);
    });
});

let editingContactIndex = -1;

function onDeviceReady() {
    chargerContacts();
    document.getElementById("saveContactBtn").addEventListener("click", ajouterOuModifierContact);
}

function chargerContacts() {
    const contacts = getContacts();
    afficherListeContacts(contacts);
}

function afficherListeContacts(contacts) {
    const contactList = document.getElementById("contactList");
    contactList.innerHTML = "";

    contacts.forEach((contact, index) => {
        const contactItem = document.createElement("li");
        contactItem.className = "list-group-item d-flex justify-content-between align-items-center";
        contactItem.innerHTML = `
            <span>${contact.nom} - Téléphone : ${contact.telephone}</span>
            <div>
                <button class="btn btn-primary btn-sm me-2" onclick="editContact(${index})">Modifier</button>
                <button class="btn btn-danger btn-sm" onclick="deleteContact(${index})">Supprimer</button>
            </div>
        `;
        contactList.appendChild(contactItem);
    });
}

function ajouterOuModifierContact() {
    const nom = document.getElementById("nom").value;
    const telephone = document.getElementById("telephone").value;

    if (!nom || !telephone) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    const nouveauContact = { nom, telephone };
    let contacts = getContacts();

    if (editingContactIndex > -1) {
        contacts[editingContactIndex] = nouveauContact;
        editingContactIndex = -1;
    } else {
        contacts.push(nouveauContact);
    }

    setContacts(contacts);
    chargerContacts();

    document.getElementById("nom").value = "";
    document.getElementById("telephone").value = "";
    const modalElement = document.getElementById("addContactModal");
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
}

function editContact(index) {
    const contacts = getContacts();
    const contact = contacts[index];
    document.getElementById("nom").value = contact.nom;
    document.getElementById("telephone").value = contact.telephone;
    editingContactIndex = index;
    const modalElement = document.getElementById("addContactModal");
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

function deleteContact(index) {
    let contacts = getContacts();
    contacts.splice(index, 1);
    setContacts(contacts);
    chargerContacts();
}

function filtrerContacts(recherche) {
    const contacts = getContacts();
    const contactList = document.getElementById("contactList");
    contactList.innerHTML = "";

    const contactsFiltres = contacts.filter(contact => {
        return contact.nom.toLowerCase().includes(recherche.toLowerCase()) ||
               contact.telephone.includes(recherche);
    });

    afficherListeContacts(contactsFiltres);
}

function getContacts() {
    const contacts = localStorage.getItem("contacts");
    return contacts ? JSON.parse(contacts) : [];
}

function setContacts(contacts) {
    localStorage.setItem("contacts", JSON.stringify(contacts));
}
