import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-toast/paper-toast.js';
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
class AdminPage extends PolymerElement {
    static get template() {
        return html`
<style>
    :host {
        display: block;

    }
    #plans{
        vertical-align: sub;

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
<iron-ajax id="ajax" handle-as="json" on-response="_handleResponse" content-type="application/json"
    on-error="_handleError"></iron-ajax>
<div id="container">
    <h1>Admin page </h1>
    <h3>From  : <datetime-picker date={{fromDate}} time={{fromTime}} ></datetime-picker>
        To : <datetime-picker date={{toDate}} time={{toTime}}></datetime-picker>
       <span id="plans"> Available Plans:</span>
        <paper-dropdown-menu id="plan" >
            <paper-listbox slot="dropdown-content" class="dropdown-content" selected="0">
                <template is="dom-repeat" items={{PlanDetails}}>
                    <h3>
                        <paper-item>{{item.planName}} ( ₹ {{item.planCost}}) / second</paper-item>
                    </h3>
                </template>
            </paper-listbox>
        </paper-dropdown-menu> 
     
        <paper-button raised id="add" on-click="_handleAdd">Add</paper-button>
    </h3>
    <table-element slots-available={{slotsAvailable}} headings-given={{headingsGiven}}></table-element>
</div>
<paper-toast text="Slot Added" id="add"></paper-toast>
<paper-toast text="Date Must Be Equal" id="date"></paper-toast>
<paper-toast text="Enter Correct Time" id="date1"></paper-toast>
<paper-toast text="Can't Add Same" id="same"></paper-toast>
`;
    }

    
  /**
   * @description declaration of properties and value.
   */
    static get properties() {
        return {
            PlanDetails: {
                type: Array,
                value: []
            },


            slotsAvailable: {
                type: Array,
                value: []
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
            fromDate: {
                type: String,
                value: ''
            },
            action: {
                type: String,
                value: 'plan'
            },
            fromTime: {
                type: String,
                value: ''
            },
            toDate: {
                type: String,
                value: ''
            
            },
            toTime: {
                type: String
            },
            id: Number
        };
    }

    
    /**
     * @description as soon as page load, make ajax call method will run
     */
    connectedCallback() {
        super.connectedCallback();
        this._makeAjax(`${baseUrl.baseUrl}/admanagement/plans`, 'get', null)


    }
    
    /**
     * @description it will check the from date and to date
     * it will check that from date must be current date or future date.
     */
    _checkDate() {
        let selectedText = this.fromDate;
        var selectedDate = new Date(selectedText);
        var now = new Date();
        if (selectedDate <= now) {
            alert("Date must be in the future");
        }

    }
      
    /**
     * @description this method will handle the response if user credentials are valid and
     * calling the multiple api with in this method.
     */
    _handleResponse(event) {
        switch (this.action) {
            case 'plan':
                this.PlanDetails = event.detail.response;
                let id = sessionStorage.getItem('id')
                this._makeAjax(`${baseUrl.baseUrl}/admanagement/slots/${id}`, 'get', null)
                this.action = 'slots'
                break;
            case 'slots':
                this.slotsAvailable = event.detail.response;
                break;
            case 'addSlots':
                let data = event.detail.response;
                this._makeAjax(`${baseUrl.baseUrl}/admanagement/plans`, 'get', null)
                this.action = 'plan'
                break;
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
     * this method will handle the error if user credentials are invalid or
     *  if if encounter error from backend server.
     */
    _handleError() {
        this.$.same.open();
    }


    /**
     * @description this method spliting price value.
     */
    _handleAdd() {
        let a = this.$.plan.value.split('(');
        let a1 = a[1];
        let b = a1.split(')');
        let b1 = b[0];
        let c = b1.split('₹');
        let price = c[1];
        console.log(price)
        for (let i = 0; i < this.PlanDetails.length; i++) {
            if (this.PlanDetails[i].planCost == price) {
                this.id = this.PlanDetails[i].planId
            }
        } let fromDate = this.fromDate;
        let toDate = this.toDate;
        let fromTime = this.fromTime.slice(0, 8);
        let toTime = this.toTime.slice(0, 8);
        this.id = sessionStorage.getItem('id');
        let obj = {
            date: fromDate, fromTime: fromTime,
            toTime: toTime, planId: this.id, slotStatus: "AVAILABLE", userId: this.id
        };
        console.log(fromDate, toDate);
        if (!(fromDate == toDate)) {
            this.$.date.open();
        } else if (toTime < fromTime) {
            this.$.date1.open();
        }
        else {
            this.$.add.open();
            this._makeAjax(`${baseUrl.baseUrl}/admanagement/slots`, 'post', obj);
            this.action = 'addSlot';
        }

    }
}

window.customElements.define('admin-page', AdminPage);