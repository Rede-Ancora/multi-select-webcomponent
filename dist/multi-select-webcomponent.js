(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.MultiselectWebcomponent = factory());
})(this, (function () {
    'use strict';

    class MultiselectWebcomponent extends HTMLElement {
        constructor() {
            var _a, _b;
            super();
            this.options = [];
            this.singleSelectMode = this.getAttribute('singleSelect') === 'true';
            this.disableSelectAll = this.getAttribute('disableselectall') === 'true';
            this.searchbox = document.createElement('input');
            this.dropdown = document.createElement('div');
            this.selected = document.createElement('div');
            this.buttons = document.createElement('div');
            // Keeping options
            this.querySelectorAll('option').forEach(option => this.options.push(option.cloneNode(true)));
            this.setValuesOnConstructor(this.getAttribute('value'));
            // Search input
            this.searchbox.type = 'text';
            this.searchbox.className = `msw-searchbox ${this.getAttribute('searchbox') || ''}`;
            this.searchbox.style.flexGrow = '1';
            this.searchbox.style.border = '0';
            this.searchbox.style.outline = 'none';
            this.searchbox.addEventListener('keyup', (e) => this.onSearchboxKeyup(e));
            // Selected
            this.selected.className = `msw-selected ${this.getAttribute('selected') || ''}`;
            this.selected.style.display = 'flex';
            this.selected.style.flexWrap = 'wrap';
            this.selected.style.flexGrow = '1';
            // Buttons
            this.buttons.style.display = 'flex';
            // Dropdown
            this.dropdown.className = `msw-dropdown ${this.getAttribute('dropdown') || ''}`;
            this.dropdown.style.display = 'none';
            this.dropdown.style.width = '100%';
            this.dropdown.style.position = 'absolute';
            this.dropdown.style.zIndex = '2';
            this.dropdown.addEventListener('click', () => this.onDropdownClick());
            // Structure
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.height = 'max-content';
            this.innerHTML = '';
            this.appendChild(this.selected);
            this.appendChild(this.buttons);
            (_a = this.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(this.dropdown, this.nextSibling);
            // Events
            this.addEventListener('click', () => this.onMultiselectClick());
            (_b = this.parentElement) === null || _b === void 0 ? void 0 : _b.addEventListener('mouseleave', () => this.dropdown.style.display = 'none');
            // Attributes
            this.searchbox.placeholder = this.getAttribute('placeholder') || '';
            const disabled = this.getAttribute('disabled');
            if (disabled && disabled !== 'false') {
                this.searchbox.disabled = true;
            }
            // Build
            this.build();
        }
        set value (value) {
            for (const option of this.options) {
                option.selected = false;
            }
            if (!value || value.length == 0) {
                return;
            }
            for (const option of this.options) {
                if (value.includes(option.value)) {
                    option.selected = true;
                }
            }
            this.build();
        }
        setValuesOnConstructor (value) {
            if (!value) {
                return;
            }
            const values = value.split(',');
            for (const option of this.options) {
                if (values.includes(option.value)) {
                    option.selected = true;
                }
            }
        }
        get value () {
            const ret = [];
            for (const option of this.options) {
                if (option.selected) {
                    ret.push(option.value);
                }
            }
            return ret;
        }
        set disabled (value) {
            this.setAttribute('disabled', value ? 'true' : 'false');
            this.searchbox.disabled = value;
            this.build();
        }
        get disabled () {
            const disabled = this.getAttribute('disabled');
            if (disabled && disabled !== 'false') {
                return true;
            }
            return false;
        }
        set placeholder (value) {
            this.setAttribute('placeholder', value);
            this.searchbox.placeholder = value;
        }
        get placeholder () {
            return this.getAttribute('placeholder');
        }
        clear () {
            this.options = [];
            this.build();
        }
        build () {
            this.selected.innerHTML = '';
            this.dropdown.innerHTML = '';
            this.buttons.innerHTML = '';
            for (const option of this.options) {
                if (option.selected) {
                    this.selected.appendChild(this.buildSelectedItem(option));
                }
                else {
                    this.dropdown.appendChild(this.buildDropdownItem(option));
                }
            }
            this.selected.appendChild(this.searchbox);
            if (!this.disableSelectAll) {
                this.unbuildSelectAllButton();
            } else if (this.dropdown.innerHTML !== '') {
                this.buttons.appendChild(this.buildSelectAllButton());
            }
            if (this.selected.querySelectorAll('.msw-selecteditem').length > 0) {
                this.buttons.appendChild(this.buildClearButton());
            }
            this.dispatchEvent(new Event('change'));
        }
        buildSelectedItem (option) {
            const item = document.createElement('div');
            item.style.userSelect = 'none';
            item.style.webkitUserSelect = 'none';
            item.className = `msw-selecteditem ${this.getAttribute('selecteditem') || ''}`;
            item.innerHTML = option.textContent;
            item.dataset.value = option.value;
            if (!this.disabled) {
                item.addEventListener('click', (e) => this.onSelectedClick(e));
            }
            return item;
        }
        buildDropdownItem (option) {
            if (this.getAttribute('item')) {
                console.warn('[MultiSelectWebcomponent]: Use of attribute "item" is deprecated - it shall be removed in next versions. Use "dropdownitem" instead.');
            }
            const item = document.createElement('div');
            item.style.userSelect = 'none';
            item.style.webkitUserSelect = 'none';
            item.className = `msw-dropdownitem ${this.getAttribute('dropdownitem') || this.getAttribute('item') || ''}`;
            item.innerHTML = option.textContent;
            item.dataset.value = option.value;
            item.addEventListener('click', (e) => this.onItemClick(e));
            return item;
        }
        buildClearButton () {
            const button = document.createElement('button');
            button.className = `msw-clearbutton ${this.getAttribute('clearbutton') || ''}`;
            const buttonSpanClass = this.getAttribute('clearbuttonspan');
            if (buttonSpanClass == null) {
                button.textContent = 'C';
            }
            else {
                const span = document.createElement('span');
                span.className = `msw-clearbuttonspan ${buttonSpanClass}`;
                button.appendChild(span);
            }
            const buttonTitle = this.getAttribute('clearbuttontitle');
            button.title = buttonTitle ? buttonTitle : 'Clear Selection';
            button.addEventListener('click', (e) => this.onClearClick(e));
            button.disabled = this.disabled;
            return button;
        }
        buildSelectAllButton () {
            const button = document.createElement('button');
            button.className = `msw-selectallbutton ${this.getAttribute('selectallbutton') || ''}`;
            const buttonSpanClass = this.getAttribute('selectallbuttonspan');
            if (buttonSpanClass == null) {
                button.textContent = 'A';
            }
            else {
                const span = document.createElement('span');
                span.className = `msw-selectallbuttonspan ${buttonSpanClass}`;
                button.appendChild(span);
            }
            const buttonTitle = this.getAttribute('selectallbuttontitle');
            button.title = buttonTitle ? buttonTitle : 'Select All';
            button.addEventListener('click', (e) => this.onSelectAllClick(e));
            button.disabled = this.disabled;
            return button;
        }
        unbuildSelectAllButton () {
            const selectAllButton = this.shadowRoot?.querySelector('.msw-selectallbutton');
            if (selectAllButton) {
                selectAllButton.removeEventListener('click', this.onSelectAllClick);
                selectAllButton.remove();
            }
        }
        findOptionByValue (value) {
            for (const option of this.options) {
                if (value === option.value) {
                    return option;
                }
            }
        }
        chooseOption (option) {
            if (this.singleSelectMode) {
                for (const existingOption of this.options) {
                    existingOption.selected = false;
                }
            }
            if (option) {
                option.selected = true;
            }
            this.searchbox.value = '';
            this.build();
        }
        onItemClick (e) {
            this.chooseOption(this.findOptionByValue(e.currentTarget.dataset.value));
            this.dropdown.style.display = 'none';
            this.searchbox.focus();
        }
        onSelectedClick (e) {
            const option = this.findOptionByValue(e.currentTarget.dataset.value);
            if (option) {
                option.selected = false;
            }
            this.build();
        }
        onClearClick (e) {
            this.options.forEach(option => option.selected = false);
            this.build();
            this.searchbox.value = '';
            this.searchbox.focus();
            e.stopPropagation();
        }
        onSelectAllClick (e) {
            this.options.forEach(option => option.selected = true);
            this.build();
            this.dropdown.style.display = 'none';
            this.searchbox.value = '';
            this.searchbox.focus();
            e.stopPropagation();
        }
        onMultiselectClick () {
            if (this.disabled === true)
                return;
            this.dropdown.style.display = 'block';
            this.searchbox.focus();
        }
        onDropdownClick () {
            this.searchbox.focus();
        }
        onSearchboxKeyup (e) {
            if ((e.key === 'Enter' || e.key === 'NumpadEnter') && this.searchbox.value !== '' && this.dropdown.firstChild) {
                this.chooseOption(this.findOptionByValue(this.dropdown.firstChild.dataset.value));
                this.searchbox.focus();
                return;
            }
            this.dropdown.innerHTML = '';
            if (this.searchbox.value === '') {
                for (const option of this.options) {
                    if (!option.selected) {
                        this.dropdown.appendChild(this.buildDropdownItem(option)); // build with all
                    }
                }
            }
            else {
                for (const option of this.options) {
                    if (!option.selected && option.textContent && option.textContent.toLocaleUpperCase().indexOf(this.searchbox.value.toLocaleUpperCase()) >= 0) {
                        this.dropdown.appendChild(this.buildDropdownItem(option)); // build with search results
                    }
                }
            }
            this.dropdown.style.display = 'block';
        }
    }

    return MultiselectWebcomponent;

}));
