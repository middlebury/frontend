import { $, $$, on } from './utils/dom';

/**
 * Accessible tabs widget
 *
 * Adapted from https://inclusive-components.design/tabbed-interfaces/
 */
class Tabs {
  constructor(el, index) {
    this.elem = el;

    this.id = index;

    this.tablist = $('[data-tabs-list]', el);
    this.tabs = $$('[data-tabs-tab]', el);
    this.panels = $$('[data-tabs-panel]', el);

    this.init();
  }

  getTabId = index => `tabs-${this.id}-${index}`;

  init() {
    // Add the tablist role to the first <ul> in the .tabbed container
    this.tablist.setAttribute('role', 'tablist');

    // Add semantics are remove user focusability for each tab
    this.tabs.forEach((tab, i) => {
      tab.setAttribute('role', 'tab');
      // TODO: ids need to be unique on page
      tab.setAttribute('id', this.getTabId(i));
      tab.setAttribute('tabindex', '-1');
      tab.parentNode.setAttribute('role', 'presentation');
    });

    // Add tab panel semantics and hide them all
    this.panels.forEach((panel, i) => {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('tabindex', '-1');
      panel.setAttribute('aria-labelledby', this.tabs[i].id);
      panel.hidden = true;
    });

    this.addListeners();

    // Initially activate the first tab and reveal the first tab panel
    this.showTab(0);
  }

  showTab(index) {
    // Make the active tab focusable by the user (Tab key)
    this.tabs[index].removeAttribute('tabindex');
    this.tabs[index].setAttribute('aria-selected', 'true');
    this.panels[index].hidden = false;
  }

  addListeners() {
    this.tabs.forEach((tab, i) => {
      // Handle clicking of tabs for mouse users
      on(tab, 'click', this.handleTabClick);

      // Handle keydown events for keyboard users
      on(tab, 'keydown', e => this.handleTabKeyDown(e, i));
    });
  }

  handleTabClick = e => {
    e.preventDefault();

    const currentTab = $('[aria-selected]', this.tablist);

    // do nothing if tab already shown
    if (e.currentTarget === currentTab) {
      return;
    }

    this.switchTab(currentTab, e.currentTarget);
  };

  handleTabKeyDown = (e, i) => {
    // Get the index of the current tab in the tabs node list
    const index = [].indexOf.call(this.tabs, e.currentTarget);
    // Work out which key the user is pressing and
    // Calculate the new tab's index where appropriate
    let dir =
      e.which === 37
        ? index - 1
        : e.which === 39
        ? index + 1
        : e.which === 40
        ? 'down'
        : null;

    // check for null instead of !dir since dir can be index 0
    if (dir === null) {
      return;
    }

    e.preventDefault();

    // If the down key is pressed, move focus to the open panel,
    // otherwise switch to the adjacent tab
    if (dir === 'down') {
      return this.panels[i].focus();
    }

    // loop tabs if on first tab or last
    if (dir > this.tabs.length - 1) {
      dir = 0;
    } else if (dir === -1) {
      dir = this.tabs.length - 1;
    }

    if (this.tabs[dir]) {
      this.switchTab(e.currentTarget, this.tabs[dir]);
    }
  };

  switchTab = (oldTab, newTab) => {
    // Get the indices of the new and old tabs to find the correct
    // tab panels to show and hide
    const index = [].indexOf.call(this.tabs, newTab);
    const oldIndex = [].indexOf.call(this.tabs, oldTab);

    oldTab.removeAttribute('aria-selected');
    oldTab.setAttribute('tabindex', '-1');
    this.panels[oldIndex].hidden = true;

    this.showTab(index);
    newTab.focus();
  };
}

const tabs = $$('[data-tabs]');
tabs.forEach((el, i) => new Tabs(el, i));

export default Tabs;
