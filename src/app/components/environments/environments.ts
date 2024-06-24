
import { Injectable } from "@angular/core";
import { EncryptService } from "../shared/services/encrypt.service";

@Injectable({
    providedIn: 'root'
})

export class Environments {

    constructor( private encrypt: EncryptService ) { }
        
    // apingRok: any = 'http://181.188.224.4:5208';
    // apingRok: any = 'http://192.168.100.12:9095';
    // apingRok: any = 'http://192.168.55.173:9095';
    // apingRok:    any = 'https://853e7b938358.ngrok.app';
    apingRok: any = 'https://sfiback.azurewebsites.net';


    version: string = 'V.1.0.1.7';
    es:      number = 5;
    hash:    number = 10
    encode:  number = 99

    apiurl(): string {
        const  env:string = this.apingRok+'/api/';
        return env;
    }

    apiUrlHub(): string {
        const  envHub: string = this.apingRok+'/hubs/';
        return envHub;
    }

    apiUrlStorage(): string {
        const  envstorage:string = this.apingRok+'/storage/';
        return envstorage;
    }

    apiUrlIcon(): string {
        const  envicon = this.apingRok+'/iconsApp/';
        return envicon;
    }

    TokenJWT():string {
        let xtoken: any = sessionStorage.getItem('token');
        let x: any = this.encrypt.decryptWithAsciiSeed(xtoken, this.es, this.hash);
        return x;
    }

    appTheme: appTheme = {
        colorPrimary:     '#0f5499',
        colorSecondary:   '#A5CF61',
        colorSecondary_A: '#6F9B3C',
        colorSecondary_B: '#558257',
        colorSecondary_C: '#1B456F',
    };

    getAppTheme(): appTheme {
        return this.appTheme;
    }

}

export interface  appTheme {
    colorPrimary:     string,
    colorSecondary:   string,
    colorSecondary_A: string,
    colorSecondary_B: string,
    colorSecondary_C: string
}
