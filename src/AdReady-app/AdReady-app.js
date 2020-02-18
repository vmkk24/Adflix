/**
* this is the main routing page of this application.
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-icons/hardware-icons.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/polymer/lib/elements/dom-if.js'
import '@polymer/iron-icons/places-icons.js';
import '@polymer/app-route/app-route.js';
import '@polymer/app-route/app-location.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);
// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MyAppGlobals.rootPath);

/**
 * @description class that provides the features including template, properties, data-binding,
 *  ajax call,handling response and property change observation.
 */
class AdReadyApp extends PolymerElement {
  static get template() {
    return html`
    <style>
    :host {
      --app-primary-color: #ff7424;
      --app-secondary-color: black;
      font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      display: block;
    }
    app-drawer-layout:not([narrow]) [drawer-toggle] {
      display: none;
    }
    app-header {
      color: #fff;
      background-color: rgb(66, 135, 245);
    }
   h3{
     color:white
   }
    .drawer-list {
      margin: 0 20px;
  
    }
    .drawer-list a {
      display: block;
      padding: 0 16px;
      text-decoration: none;
      color: var(--app-secondary-color);
      line-height: 40px;
    }
    .drawer-list a.iron-selected {
      color: black;
      font-weight: bold;
    }
    .header{
      float:right;
margin-left:30px;
cursor: pointer;
      color:white;
    }
  </style>
  <app-location route="{{route}}">
  </app-location>
  <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}">
  </app-route>
  <app-drawer-layout fullbleed="" narrow="{{narrow}}">
    <!-- Drawer content -->
    <!-- Main content -->
    <app-header-layout has-scrolling-region="">
      <app-header slot="header" condenses="" reveals="" effects="waterfall">
        <app-toolbar>
          <div main-title="">
            <h3>
          AdReady
            </h3>
          </div>
          <template is="dom-if" if={{login}}>
          <h2>Welcome , {{userName}}</h2>
          <a raised class="header" on-click="_handleLogout"> Logout<iron-icon icon="hardware:keyboard-tab"></iron-icon></a>
          </template>
        </app-toolbar>
      </app-header>
      <iron-pages selected="[[page]]" attr-for-selected="name" role="main">
      <home-page name="home"></home-page>
      <login-page name="login"></login-page>
      <admin-page name="admin-page"></admin-page>

      <my-bookings name="my-bookings"></my-bookings>

      <salesperson-page name="salesperson-page"></salesperson-page>
    </iron-pages>
    </app-header-layout>
  </app-drawer-layout>
  
  `;
  }

  /**
   * @description declaration of properties and value.
   */
  static get properties() {
    return {
      page: {
        type: String,
        reflectToAttribute: true,
        observer: '_pageChanged'
      },
      userName: {

        type: String,
        value: sessionStorage.getItem("name"),
        reflectToAttribute: true,
        observer: '_nameChanged'

      },
      schemeId: {
        type: Number,
        value: 0,
        observer: '_idChanged'
      },
      login: {
        type: Boolean,

        value: sessionStorage.getItem("login"),

        reflectToAttribute: true,
        observer: '_loginChanged'
      },
      routeData: Object,
      subroute: Object,

    };
  }

  /**
   * @description  observing the page change
   */
    static get observers() {
    return [
      '_routePageChanged(routeData.page)'
    ];
  }
    /**
     * @description this method will show the current user name
     *  in dashboard screen.
     */
  _nameChanged() {
    this.userName = this.userName
  }
/**
 * @description this will change value of login button to logout button
 */
  _loginChanged() {
    this.addEventListener('refresh-login', (event) => {
      this.login = event.detail.login;
      this.userName = event.detail.name;
    })
  }

/**
 * @description this method will clear the session storage
 *  and will redirect to home page. 
 */
  _handleLogout() {
    sessionStorage.clear();
    this.login = false;
    this.set('route.path', './home')
  }

  /**
  * Show the corresponding page according to the route.
  * If no page was found in the route data, page will be an empty string.
  * Show 'view1' in that case. And if the page doesn't exist, show 'view404'.
  */
  _routePageChanged(page) {
    if (!page) {
      this.page = 'login';
    } else if (['login', 'admin-page', 'salesperson-page', 'my-bookings'].indexOf(page) !== -1) {

      this.page = page;
    } else {
      this.page = 'login';
    }
  }
  /**
  * Import the page component on demand.
  * Note: `polymer build` doesn't like string concatenation in the import
  * statement, so break it up.
  */
  _pageChanged(page) {
    switch (page) {


      case 'login':
        import('./login-page.js');
        break;

      case 'admin-page':
        import('./admin-Page.js');
        break;
      case 'salesperson-page':
        import('./salesPerson-page.js');
        break;
      case 'my-bookings':
        import('./my-bookings.js');
        break;

    }
  }

}

window.customElements.define('adready-app', AdReadyApp);
