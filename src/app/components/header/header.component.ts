import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IUser } from '../../interfaces/iuser.interface';
import { MessagesService } from '../../services/messages.service';
import { NotificationsService } from '../../services/notifications.service';
import { IMessage } from '../../interfaces/imessage.interface';
import { INotification } from '../../interfaces/inotification.interface';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isLoggedIn : boolean = false;
  user!: IUser;
  userNotifications! : INotification[];
  userMessages! : IMessage[];

  authService = inject(AuthService);
  messagesService = inject(MessagesService);
  notificationsService = inject(NotificationsService);

  ngOnInit(): void {
    this.authService.getLoggedInStatus().subscribe(status => {
      this.isLoggedIn = status;
      if(this.isLoggedIn) {
        this.user = this.authService.getUser();
        this.getMessages();
      }
    });
    // Aquí puedes agregar lógica para obtener el número de mensajes y notificaciones
  }

  async getMessages() {
    this.userMessages = await this.messagesService.getLastMessagesByUser(this.user.id ? this.user.id : '');
  }

  getMessagesCount() {
    return this.userMessages.length;
  }

  async getNotifications() {
    this.userNotifications = await this.notificationsService.getNotificationsByUserId(this.user.id ? this.user.id : '');
  }

  getNotificationsCount() {
    return this.userNotifications.length
  }

  logout() {
    this.authService.logout();
  }
}
