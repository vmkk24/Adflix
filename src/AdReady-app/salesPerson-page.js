import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@fooloomanzoo/datetime-picker/datetime-picker.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-item/paper-item.js';
import '@fooloomanzoo/datetime-picker/datetime-picker.js';
import '@fooloomanzoo/datetime-picker/time-picker.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-dialog/paper-dialog.js';
import { baseUrl } from '../shared-folder/constant.js';
/**
 * @description class that provides the features including template, properties, data-binding,
 *  ajax call,handling response and property change observation.
 */
class SalesPersonPage extends PolymerElement {
    static get template() {
        return html`
<style>
    :host {
        display: block;
        height:100vh;

    }

    table,
    th,
    td {
        border: 1px solid black;
        border-collapse: collapse;
    }
h3{
    margin-bottom:10px;
}
    th,
    td {
        text-align: left;
        padding: 15px;
    }

    #tab1 {
        width: 100%;
    }

    #tab1 th {
        color: white;
    }
    paper-button{
    background-color:rgb(66, 135, 245);
    color:white;
}
    #tab1 th {
        background-color:rgb(66, 135, 245);
    }

    #tab1 tr:nth-child(odd) {
        background-color:whitesmoke;
    }

    h2 {
        text-align: center;
    }

   #modal{
      padding:30px; 
      width:100%;
      height:auto;
      border-radius:20px;
      border:1px solid black;
   }
    #container{
        background-color:white;
        padding:20px 47px 47px 47px;
    }
    #purchase{
        margin-left:45%;
    }
</style>
<app-location route="{{route}}">
</app-location>
<iron-ajax id="ajax" handle-as="json" on-response="_handleResponse" content-type="application/json"
    on-error="_handleError"></iron-ajax>
    <div id="container">
    <paper-button raised on-click="myBookings">My Bookings</paper-button>
<h2>Sales Person Portal </h2>
<table id="tab1">
    <h3>Available Plans</h3>
    <tr>
    <th>Slot Number</th>
        <th>Date</th>
        <th>From</th>
        <th>TO</th>
        <th>Plan Name</th>
        <th>Total Cost</th>
        <th>Action to Buy </th>
    </tr>
    <template is="dom-repeat" items={{PlanDetails}}>
        <tr>
        <td>{{item.slotId}}</td>
            <td>{{item.date}}</td>
            <td>{{item.fromTime}}</td>
            <td>{{item.toTime}}</td>
            <td>{{item.planName}}</td>
            <td>₹{{item.totalCost}}</td>
            <td> <paper-button raised id="login" on-click="signIn">Select</paper-button></td>
        </tr>
    </template>
</table>
</div>
<paper-dialog id="modal">
<iron-icon icon="clear" id="clearbtn" on-click="_handleClose"></iron-icon>
<h2> Purchase From This Slot</h2>
<h3>Date :  {{date}}  ||  Cost For This Plan : {{cost}}  ||  From Time : {{fromTime}} || To Time : {{toTime}}</h3>
<table id="tab1">
    <tr>
    <th>Name</th>
        <th>From Time</th>
        <th>To Time </th>
        <th>Actions</th>
    </tr>
   <template is="dom-repeat" items={{table}}>
        <tr>
        <td><paper-input label="Company Name" id="name{{index}}"></paper-input>
        <td> <time-input  id="from{{index}}" timezone="[[timezone]]" with-timezone="{{withTimezone}}"></time-input></td>
            <td><time-input  id="to{{index}}" timezone="[[timezone]]" with-timezone="{{withTimezone}}"></time-input></td>
            <td> <paper-button raised on-click="addSlot">Add</paper-button></td>

        </tr>
</template>
</table>
<paper-button raised id="purchase" on-click="purchaseSlot">Purchase</paper-button>
</paper-dialog>
<paper-toast text="Enter Valid Time " id="time"></paper-toast>
<paper-toast text="Cannaot Leave Blank Fields" id="blank"></paper-toast>
<paper-toast text="Purchased" id="purchase"></paper-toast>

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
            id: {
                type: Number,
                value: sessionStorage.getItem('id')
            },
            fromTime: {
                type: String,
                value: ''
            },
            action: {
                type: String,
                value: 'plan'
            },
            table: {
                type: Array,
                value: [1]
            },
            toTime: {
                type: String
            },
            date: {
                type: String
            },
            data: {
                type: Object
            },
            cost: {
                type: String,
                value: ''
            }, slotsBooked: {
                type: Array,
                value: []
            },
            obj: {
                type: Object,
                value: {}
            }, rowIndex: {
                type: Number,
                value: '0'
            }
        };
    }
      ready() {
    super.ready();
    if (sessionStorage.getItem('login') == null) {
      this.set('route.path', './donation-option')
    }
  }
    /**
     * @param {MouseEvent} event
     * 
     */
    signIn(event) {
        this.$.modal.open();
        this.date = event.model.item.date;
        this.data = event.model.item;
        if (event.model.item.planName == 'Gold') {
            this.cost = "₹ 30.8 / second"
        } else if (event.model.item.planName == 'Silver') {
            this.cost = "₹ 20.9 / second";
        } else {
            this.cost = "₹ 50.9 / second";
        }
        this.fromTime = event.model.item.fromTime;
        this.toTime = event.model.item.toTime;
    }

    _handleClose() {
        this.$.modal.close();
        this.table = [1];
        this.slotsBooked =[];
    }
    /**
     * @description this method redirect to my booking page.
     */
    myBookings() {
        this.set('route.path', './my-bookings');
    }
    addSlot(event) {
        let date = this.date;
        let index = event.model.index;
        this.rowIndex = index + 1;
        let adName = this.shadowRoot.querySelector(`#name${index}`).value;
        if (adName == '') {
            this.$.blank.open();

        } else {
        let fromTime = this.shadowRoot.querySelector(`#from${index}`).time.slice(0, 8);
        let toTime = this.shadowRoot.querySelector(`#to${index}`).time.slice(0, 8);
     
            this.obj = {
                adName: adName,
                date: date,
                fromTime: fromTime,
                toTime: toTime
            }
            if (fromTime < this.data.fromTime || fromTime > this.data.toTime) {
                this.$.time.open();
            } else
                if (toTime < this.data.fromTime || toTime > this.data.toTime) {
                    this.$.time.open();
                } else {
                    this.push('table', {});
                    this.push('slotsBooked', this.obj);
                }
        }
    }

    purchaseSlot() {
      
        let adName = this.shadowRoot.querySelector(`#name${this.rowIndex}`).value;
        if (adName == '') {
            this.$.blank.open();

        }else{
        let fromTime = this.shadowRoot.querySelector(`#from${this.rowIndex}`).time.slice(0, 8);
        let toTime = this.shadowRoot.querySelector(`#to${this.rowIndex}`).time.slice(0, 8);
        this.obj = {
            adName: adName,
            date: date,
            fromTime: fromTime,
            toTime: toTime
        }
        if (fromTime < this.data.fromTime || fromTime > this.data.toTime) {
            this.$.time.open();
        } else
            if (toTime < this.data.fromTime || toTime > this.data.toTime) {
                this.$.time.open();
            } else {
                this.push('table', {});
                this.push('slotsBooked', this.obj);
            }
        let slotId = this.data.slotId;
        let userId = sessionStorage.getItem('id');
        let sendData = {
            bookSlotRequestDtoList: this.slotsBooked,
            slotId: slotId,
            userId: userId
        }
        this._makeAjax(`${baseUrl.baseUrl}/admanagement/slots/book`, 'post', sendData)
        this.action = 'purchase'
    }
    }

    /**
     * @description as soon as page load, make ajax call method will run
     */
    connectedCallback() {
        super.connectedCallback();
        this._makeAjax(`${baseUrl.baseUrl}/admanagement/slots`, 'get', null)

    }

    /**
    * @description this method will handle the response if user credentials are valid,
    * it will response the plan details.
    */
    _handleResponse(event) {
        switch (this.action) {
            case 'plan':
                this.PlanDetails = event.detail.response;
                this.table = [1];
                this.slotsBooked = [];
                break;
            case 'purchase':
                this.$.purchase.open();
                this._makeAjax(`${baseUrl.baseUrl}/admanagement/slots`, 'get', null)
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

}

window.customElements.define('salesperson-page', SalesPersonPage);
