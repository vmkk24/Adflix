import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@fooloomanzoo/datetime-picker/datetime-picker.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import './table.js';
import {baseUrl} from '../shared-folder/constant.js';
/**
 * @description class that provides the features including template, properties, data-binding,
 *  ajax call,handling response and property change observation.
 */
class MyBookings extends PolymerElement {
    static get template() {
        return html`
<style>
    :host {
        display: block;

    }





    h2 {
        text-align: center;
    }
    datetime-picker{
        margin:0px 10px 0px 10px;
    }
    #container {
        background-color: white;
        padding: 20px 47px 47px 47px;
        height: 100%;
    }

    #tableDiv {
        margin: 12px;
    }
#add{
    margin-left:45px;
}
    paper-button {
        background-color: rgb(66, 135, 245);
        color: white;
    
    }
</style>
<app-location route="{{route}}">
</app-location>
<iron-ajax id="ajax" handle-as="json" on-response="_handleResponse" content-type="application/json"
    on-error="_handleError"></iron-ajax>
<div id="container">
<paper-button raised on-click="myBookings">Back</paper-button>
    <h1>My Bookings</h1>
    <table-element slots-available={{slotsAvailable}} headings-given={{headingsGiven}}></table-element>
</div>
<paper-toast text="Slot Added" id="add"></paper-toast>
`;
    }
    
  /**
   * @description declaration of properties and value.
   */
    static get properties() {
        return {
            slotsAvailable: {
                type: Array,
                value: []
            },

            slotsAvailable: {
                type: Array,
                value: []
            },
            action: {
                type: String,
                value: 'plan'
            },
            headingsGiven: {
                type: Array,
                value: [
                    "Slot Number",
                    "Date",
                    "From",
                    "To",
                    "Plan Type",
                    "Total Cost",
                    "Slot Status"
                ]
            },
            id: Number
        };
    }
  
    /**
     * @description as soon as page load, make ajax call method will run
     */
    connectedCallback() {
        super.connectedCallback();
        let id = sessionStorage.getItem('id');
        this._makeAjax(`${baseUrl.baseUrl}/admanagement/slots/${id}/bookedslots`, 'get', null)

    }

     /**
     * @description this method will handle the response if user credentials are valid,
     * it will response the slots which will handle in table format.
     */
    _handleResponse(event) {
        switch (this.action) {
            case 'plan':
                this.slotsAvailable = event.detail.response;
                console.log(this.slotsAvailable )
                break;
      
        }
    }
    /**
     * @description this method will direct page to salesperson
     */
    myBookings(){
        this.set('route.path','./salesperson-page');
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




    
}
window.customElements.define('my-bookings', MyBookings);