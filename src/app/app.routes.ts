import { Routes } from '@angular/router';
import {ProselyteHome} from "./component/proselyte-home/proselyte-home";
import {PrescriptMessage} from "./component/prescript-message/prescript-message";

export const routes: Routes = [
    {
        path: '',
        component: ProselyteHome,
        title: 'Index Proselyte'
    },
    {
        path: 'prescript',
        component: PrescriptMessage,
        title: 'Prescript'
    }
];