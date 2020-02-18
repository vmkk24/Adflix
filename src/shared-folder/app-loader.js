import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import '@polymer/paper-progress/paper-progress.js';
/**
* @customElement
* @polymer
*/
class AppLoader extends PolymerElement {
    static get template() {
        return html`
    <style>
    :host {
      display: block;

    }
    paper-spinner-lite.thick {
        --paper-spinner-stroke-width: 6px;
      }
   
    </style>

    <template is="dom-if" if="{{loading}}">
    <paper-progress value="10" indeterminate="true" style="width:100%;" ></paper-progress>
        </template>
 
  `;
    }
}

window.customElements.define('app-loader', AppLoader);
