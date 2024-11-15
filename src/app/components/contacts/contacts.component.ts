import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent implements OnInit {
  contacts: any[] = [];
  newContact = { firstName: '', lastName: '', email: '' };

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.fetchContacts();
  }

  fetchContacts() {
    this.contactService.getContacts().subscribe(data => {
      this.contacts = data;
    });
  }

  addContact() {
    if (this.newContact.firstName && this.newContact.lastName && this.newContact.email) {
      this.contactService.addContact(this.newContact).subscribe(() => {
        this.fetchContacts();
        this.newContact = { firstName: '', lastName: '', email: '' };
        alert('Contact added successfully!');
      });
    } else {
      alert('Please fill in all fields.');
    }
  }

  deleteContact(id: number) {
    this.contactService.deleteContact(id).subscribe(() => {
      this.fetchContacts();
      alert('Contact deleted successfully!');
    });
  }
}
