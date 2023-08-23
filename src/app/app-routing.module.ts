import { NgModule } from '@angular/core';
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { GameMasterHomeComponent } from './game-master/game-master-home/game-master-home.component';
import { AuthGuard } from './services/auth/auth.guard';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { HandActionsComponent } from './game-master/hand-actions/hand-actions.component';
import { PlayersTabComponent } from './players/players-tab/players-tab.component';
import { SettingsTabComponent } from './settings/settings-tab/settings-tab.component';
import { DirectorsComponent } from './directors/directors.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HomeComponentComponent } from './home-component/home-component.component';

const routes: Routes = [
	{
		path: '',
		component: WelcomePageComponent
	},
	{
		path: 'previous',
		component: GameMasterHomeComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'main',
		component: HomeComponentComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'manageUsers',
		component: PlayersTabComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'settings',
		component: SettingsTabComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'AccountSettings',
		component: DirectorsComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'gameMaster',
		component: GameMasterHomeComponent,
		canActivate: [AuthGuard]
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
	providers: [AuthGuard]
})
export class AppRoutingModule {}
