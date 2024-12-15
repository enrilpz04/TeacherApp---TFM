import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IUser } from '../../interfaces/iuser.interface';
import { MessagesService } from '../../services/messages.service';
import { NotificationsService } from '../../services/notifications.service';
import { IMessage } from '../../interfaces/imessage.interface';
import { INotification } from '../../interfaces/inotification.interface';
import Swal,{SweetAlertOptions} from 'sweetalert2';
import moment from 'moment';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isLoggedIn: boolean = false;
  user!: IUser;
  userNotifications: INotification[] = [];
  userMessages: IMessage[] = [];
  isLoading: boolean = true;

  authService = inject(AuthService);
  messagesService = inject(MessagesService);
  notificationsService = inject(NotificationsService);

  ngOnInit(): void {
    this.authService.getLoggedInStatus().subscribe(status => {
      this.isLoggedIn = status;
      if (this.isLoggedIn) {
        this.authService.getUser().subscribe(user => {
          if (user) {
            this.user = user;
            console.log(this.user);
            this.getMessages();
            this.getNotifications();
            this.isLoading = false;
          }
        });
      }
    }
    );
    this.isLoading = false
  }

  async getMessages() {
    this.userMessages = await this.messagesService.getLastMessagesByUser(this.user.id ? this.user.id : '');
    console.log(this.userMessages);
  }

  getMessagesCount() {
    return this.userMessages.length;
  }

  async getNotifications() {
    this.userNotifications = await this.notificationsService.getNotificationsByUserId(this.user.id ? this.user.id : '');
  }

  getNotificationsCount() {
    return this.userNotifications.filter(noti=> !noti.watched).length;
  }

  logout() {
    this.authService.logout();
  }

  showNotifications(){
    let opciones:SweetAlertOptions = {
      icon: 'success',
      confirmButtonText: 'No tienes nuevas notificaciones'
    }
    let html = "<div class = 'notifications_pop'>";
    this.userNotifications.forEach(noti => {
      if(!noti.watched) {
        let fecha = moment(noti.date).format('DD/MM/YYYY HH:mm');
        html+="<p>" + noti.message + " <span>" + fecha + "</span></div>";
        opciones.confirmButtonText="Marcar como leídas";
        opciones.icon = undefined;
        opciones.title= "Nuevas Notificaciones";
      }
    });
    html += "</div>";
    opciones.html=html;
      Swal.fire(opciones).then((result) => {
      if (result.isConfirmed) {
        this.watchedAllNotifications();
      }
    });
  }

  watchedAllNotifications(){
    this.notificationsService.watchedAllNotificationsByUserId(this.user.id ? this.user.id : '');
    this.userNotifications = [];
  }
}
    // Aquí puedes agregar lógica para obtener el número de mensajes y notificaciones
