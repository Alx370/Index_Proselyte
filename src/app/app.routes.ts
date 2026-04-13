import { Routes } from '@angular/router';
import {ProselyteHome} from "./component/proselyte-home/proselyte-home";

export const routes: Routes = [
    {
        path: '',
        component: ProselyteHome,
        title: 'Index Proselyte'
    },
];