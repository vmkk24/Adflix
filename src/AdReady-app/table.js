import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
/**
* @customElement
* @polymer
*/
class Table extends PolymerElement {
    static get template() {
        return html`
    <style>
    :host {
      display: block;

    }
    table, th, td{
        border: 1px solid black;
        border-collapse: collapse;
        }
    th, td{
        text-align: left;
        padding: 15px;
    }
    
    #tab1{
        width: 100%;
    }
    
    #tab1 th{
        color: white;
        background-color:rgb(66, 135, 245);
    }
    
    #tab1 tr:nth-child(even)
    {
        background-color: white;
    }
    
    #tab1 tr:nth-child(odd)
    {
        background-color: rgb(255, 255, 255);
    }
    h2{
      text-align: center;
    }
    #tableDiv{
        margin:12px;
    }
    </style>
    <table id="tab1">
    <h2>Available Plans</h2>
    <tr>
         <template is="dom-repeat" items={{headingsGiven}}>
        <th>{{item}}</th>
        </template>
    </tr>
    <template is="dom-repeat" items={{slotsAvailable}}>
        <tr>
        <td>{{item.slotId}}</td>
            <td>{{item.date}}</td>
            <td>{{item.fromTime}}</td>
            <td>{{item.toTime}}</td>
            <td>{{item.planName}}</td>
            <td>₹ {{item.totalCost}}</td>
            <td>{{item.slotStatus}}</td>
        </tr>
    </template>
</table>
  `;
    }
    
   /**
   * @description declaration of properties and value.
   */
    static get properties() {
        return {
            headingsGiven: {
                type: Array
            } ,
             slotsAvailable: {
                type: Array
            }
        };
    }

  

}

window.customElements.define('table-element', Table);
