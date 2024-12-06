import { Component, inject } from '@angular/core';
import { BookingsService } from '../../../services/bookings.service';
import { AuthService } from '../../../services/auth.service';
import { IBooking } from '../../../interfaces/ibooking.interface';
import { IUser } from '../../../interfaces/iuser.interface';
import { TeachersService } from '../../../services/teachers.service';
import { ITeacher } from '../../../interfaces/iteacher.interface';
import { CommonModule } from '@angular/common';
import { Form, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './classes.component.html',
  styleUrl: './classes.component.css'
})
export class ClassesComponent {

  bookings!: IBooking[];
  user!: IUser;
  teacher!: ITeacher;
  filterForm! : FormGroup;

  bookingsService = inject(BookingsService);
  teachersService = inject(TeachersService);
  authService = inject(AuthService);

  constructor() {
    this.filterForm = new FormGroup({
      date: new FormControl("", []),
      status: new FormControl("", []),
    })
  }

  ngOnInit() {
    this.authService.getUser().subscribe(async user => {
      if (user) {
        this.user = user;
        if (this.user.rol === 'student') {
          this.bookingsService.getAllBookingsFromStudent(this.user.id!).then(bookings => {
            this.bookings = bookings;
            console.log(this.bookings);
          });
        } else {
          this.teacher = await this.teachersService.getTeacherByUserId(this.user.id!);
          this.bookingsService.getAllBookingsFromTeacher(this.teacher.id!).then(bookings => {
            this.bookings = bookings;
            console.log(this.bookings);
          })
        }
      }
    });
  }

  async cancelBooking(booking: IBooking) {
    const accepted = await this.alert('Are you sure?', 'Do you want to cancel this booking?', 'Yes', 'No');
    if (!accepted) return;
    const updatedBooking = await this.bookingsService.updateBooking({ ...booking, status: 'cancelled' });
    this.updateBookingInList(updatedBooking);
  }

  async acceptBooking(booking: IBooking) {
    const accepted = await this.alert('Are you sure?', 'Do you want to accept this booking?', 'Yes', 'No');
    if (!accepted) return;
    const updatedBooking = await this.bookingsService.updateBooking({ ...booking, status: 'confirmed' });
    this.updateBookingInList(updatedBooking);
  }

  async completeBooking(booking: IBooking) {
    const accepted = await this.alert('Are you sure?', 'Do you want to complete this booking?', 'Yes', 'No');
    if (!accepted) return;
    const updatedBooking = await this.bookingsService.updateBooking({ ...booking, status: 'completed' });
    this.updateBookingInList(updatedBooking);
  }

  async archiveBooking(booking: IBooking) {
    const accepted = await this.alert('Are you sure?', 'Do you want to archive this booking?', 'Yes', 'No');
    if (!accepted) return;
    const updatedBooking = await this.bookingsService.updateBooking({ ...booking, status: 'archived' });
    this.updateBookingInList(updatedBooking);
  }

  async activeBooking(booking: IBooking) {
    const accepted = await this.alert('Are you sure?', 'Do you want to reactive this booking?', 'Yes', 'No');
    if (!accepted) return;
    const updatedBooking = await this.bookingsService.updateBooking({ ...booking, status: 'confirmed' });
    this.updateBookingInList(updatedBooking);
  }

  updateBookingInList(updatedBooking: IBooking) {
    const index = this.bookings.findIndex(b => b.id === updatedBooking.id);
    if (index !== -1) {
      this.bookings[index] = updatedBooking;
    }
  }

  async alert(title: string, text: string, confirmButtonText: string, cancelButtonText: string): Promise<boolean> {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText
    }).then((result) => {
      return result.isConfirmed;
    });
  }

  async confirmation() {

  }

  getDataForm(){
    console.log(this.filterForm.value)
  }
}
