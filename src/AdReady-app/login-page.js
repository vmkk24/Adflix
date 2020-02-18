import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/app-route/app-location.js';
import '@polymer/paper-dialog/paper-dialog.js';

import { baseUrl } from '../shared-folder/constant.js';
/**
 * @description class that provides the features including template, properties, data-binding,
 *  ajax call,handling response and property change observation.
 */
class LoginPage extends PolymerElement {
    static get template() {
        return html`
<style>
    :host {
        display: block;
        font-family: Verdana, Geneva, Tahoma, sans-serif;

    }

    #toast {
        position: absolute;
        bottom: 400px;
    }
    #form {
        border: 1px solid rgb(0, 0, 0);
        border-radius: 20px;
        background-color: white;
        opacity: 0.9;
        ;
        width: 40%;
        min-width: 310px;
        align-content: center;
        padding: 1%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, 50%);
    }
    h2 {
        text-align: center;

    }
    #container {
        position: relative;
    }
    paper-button {
        text-align: center;
        background-color: black;
        color: white;
        position: relative;
        left: 39%;
    }
</style>
        <app-location route="{{route}}"></app-location>
<div id="container">
    <iron-form id="form">
        <form>
            <h2>Login </h2>
            <paper-input label="Phone Number" id="mobile" allowed-pattern=[0-9] type="text" value={{phone}}
                name="mobile" maxlength="10" required error-message="Please Enter Phone Number"></paper-input>
            <paper-input label="Password" id="pass" type="password" value={{password}} name="password" required
                error-message="Please Enter Password"></paper-input>
            <paper-button raised id="login" on-click="signIn">Login</paper-button>
        </form>
    </iron-form>
    <div id="toast">
    <paper-toast text={{message}}  id="blankForm"></paper-toast>
    <paper-toast text={{message}} id="wrongCredentials"></paper-toast>
    </div>
</div>
<iron-ajax id="ajax" handle-as="json" on-response="_handleResponse" content-type="application/json"
    on-error="_handleError"></iron-ajax>
 
`;
    }

    /**
    * @description declaration of properties and value.
    */
    static get properties() {
        return {
            users: Object,
            details: {
                type: Object
            },
            baseUrl: String,
            message: {
                type: String
            },
            loading: {
                type: Boolean,
                value: false
            }

        };
    }
    connectedCallback() {
        super.connectedCallback();
    }
    /**
     * this method validate the field. if credentials are true than
     *  it will login to admin or salesperson dashboard based on credential.
     */
    signIn() {

        if (this.$.form.validate()) {
            let phone = this.phone;
            let password = this.password;
            this.details = { mobile: phone, password: password }
            this.$.form.reset();
            this.loading = true;
            this._makeAjax(`${baseUrl.baseUrl}/admanagement/users/login`, "post", this.details);

        } else {
            this.$.blankForm.open();
        }
    }
    /**
     * this method will handle the error if user credentials are invalid or
     *  if if encounter error from backend server.
     */
    _handleError(event) {
        this.loading = false;
        this.users = event.detail.request.response
        console.log(this.users)
        if (this.users.statusCode == "ERR600") {
            this.message = baseUrl.ERR600;
            this.$.wrongCredentials.open();
        }
    }
    /**
     * @description this method will handle the response if user credentials are valid and
     * storing user name and id in session storage and dispatch event will send the login 
     * value to parent page .
     */
    _handleResponse(event) {
        this.users = event.detail.response
        this.loading = false;
        this.dispatchEvent(new CustomEvent('refresh-login', {
            detail: { login: true, name: this.users.userName }, bubbles:
                true, composed: true
        }))
        sessionStorage.setItem('login', true);
        sessionStorage.setItem('id', this.users.userId);

        sessionStorage.setItem('name', this.users.userName);
        console.log(this.users.role)
        if (this.users.role == "SALESPERSON") {
            this.set('route.path', './salesperson-page')
        } else {
            this.set('route.path', './admin-page')

        }
    }

    /**
     * @description calling main ajax call method
     * @param {*} url 
     * @param {*} method 
     * @param {*} postObj 
     */
    _makeAjax(url, method, postObj) {
        let ajax = this.$.ajax;
        ajax.method = method;
        ajax.url = url;
        ajax.body = postObj ? JSON.stringify(postObj) : undefined;
        ajax.generateRequest();
    }

    /**
     * @description open model dialog
     */
    _modelOpen() {
        this.$.modal.open();
    }
    /**
    * @description this method will close the paper dialog.
    */
    _modelClose() {
        this.$.modal.close();
    }



}

window.customElements.define('login-page', LoginPage);
