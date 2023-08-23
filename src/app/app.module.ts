import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogModule } from '@angular/cdk/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayerTableComponent } from './settings/player-table/player-table.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './material-module';
import { SettingsTabComponent } from './settings/settings-tab/settings-tab.component';
import { CommonModule } from '@angular/common';
import { HistoricGamesComponent } from './settings/historic-games/historic-games.component';
import { DatabasePageComponent } from './settings/database-page/database-page.component';
import { HandActionsComponent } from './game-master/hand-actions/hand-actions.component';
import { PlayersTabComponent } from './players/players-tab/players-tab.component';
import { ListPlayersComponent } from './players/list-players/list-players.component';
import { CreatePlayerComponent } from './players/create-player/create-player.component';
import { AuthInterceptor } from './services/auth/auth-interceptor';
import { GameMasterHomeComponent } from './game-master/game-master-home/game-master-home.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LoginSignupDialogComponent } from './dialogs/login-signup-dialog/login-signup-dialog.component';
import { UploadComponent } from './game-master/hand-actions/forms/upload/upload.component';
import { EBUP2PComponent } from './game-master/hand-actions/forms/ebu-p2-p/ebu-p2-p.component';
import { PortInterceptor } from 'src/port.interceptor';
import { ErrorLoggingInterceptor } from './logging/error-logging-interceptor';
import { FailureDialogComponent } from './game-master/hand-actions/forms/failure-dialog/failure-dialog.component';
import { SuccessDialogComponent } from './game-master/hand-actions/forms/success-dialog/success-dialog.component';
import { DialogComponent } from './general-components/dialog/dialog.component';
import { BboTabComponent } from './game-master/bbo-tab/bbo-tab.component';
import { HomeComponentComponent } from './home-component/home-component.component';
import { UsebioComponent } from './game-master/use-bio/usebio.component';
// Custom Modules
import { DirectorsModule } from './directors/directors.module';
import { PasswordResetComponent } from './directors/password-reset/password-reset.component';
import { ExtendedSignupComponent } from './extended-signup/extended-signup.component';

@NgModule({
	declarations: [
		AppComponent,
		PlayerTableComponent,
		SettingsTabComponent,
		HistoricGamesComponent,
		DatabasePageComponent,
		HandActionsComponent,
		PlayersTabComponent,
		ListPlayersComponent,
		CreatePlayerComponent,
		GameMasterHomeComponent,
		WelcomePageComponent,
		ToolbarComponent,
		LoginSignupDialogComponent,
		UploadComponent,
		EBUP2PComponent,
		FailureDialogComponent,
		DialogComponent,
		BboTabComponent,
		HomeComponentComponent,
		UsebioComponent,
		SuccessDialogComponent,
		PasswordResetComponent,
		ExtendedSignupComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		CommonModule,
		FormsModule,
		MatInputModule,
		MatFormFieldModule,
		MatTooltipModule,
		MatCardModule,
		MatSnackBarModule,
		MatProgressBarModule,
		MatDialogModule,
		DialogModule,
		ReactiveFormsModule,
		HttpClientModule,
		DemoMaterialModule,
		BrowserAnimationsModule,
		MatDialogModule,
		// Custom modules
		DirectorsModule,
	],

	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: PortInterceptor, multi: true },
		{
			provide: HTTP_INTERCEPTORS,
			useClass: ErrorLoggingInterceptor,
			multi: true
		}
	],

	bootstrap: [AppComponent]
})
export class AppModule {}
